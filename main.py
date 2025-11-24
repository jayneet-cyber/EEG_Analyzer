import matplotlib
# OPTIMIZATION: Agg backend prevents "GUI not found" errors on cloud servers
matplotlib.use('Agg')

import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mne
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec 
import numpy as np
import tempfile
import os
import base64
import textwrap
from io import BytesIO
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "EEG Server is Running!"}

@app.post("/analyze")
def analyze_eeg(cnt_file: UploadFile = File(...), exp_file: UploadFile = File(...)):
    
    # --- 1. FILE HANDLING ---
    try:
        # Create temporary files to store the uploads
        tmp_cnt = tempfile.NamedTemporaryFile(delete=False, suffix=".cnt")
        tmp_cnt.close() 
        tmp_cnt_path = tmp_cnt.name

        tmp_exp = tempfile.NamedTemporaryFile(delete=False, suffix=".exp")
        tmp_exp.close()
        tmp_exp_path = tmp_exp.name

        # Write data to disk
        with open(tmp_cnt_path, "wb") as buffer:
            shutil.copyfileobj(cnt_file.file, buffer)
            
        with open(tmp_exp_path, "wb") as buffer:
            shutil.copyfileobj(exp_file.file, buffer)

        # --- 2. LOAD DATA ---
        raw = mne.io.read_raw_cnt(tmp_cnt_path, preload=True, verbose=False)
        
        # --- 3. PARSE EXPERIMENT LOG ---
        trial_type_map = {}
        reaction_times = []
        
        with open(tmp_exp_path, 'r') as f:
            lines = f.readlines()
            for line in lines[8:]: 
                parts = line.strip().split('\t')
                if len(parts) < 7: parts = line.strip().split()
                if len(parts) >= 7:
                    t_id = parts[0].strip()
                    t_name = parts[1].strip()
                    t_type = parts[3].strip()
                    try: t_lat = int(parts[6].strip())
                    except: t_lat = 1000
                    
                    trial_type_map[t_id] = t_type
                    if t_type == 'R' and t_lat < 1000:
                        reaction_times.append((t_lat, t_id, t_name))

        # Calculate "Easiest" and "Toughest" tasks based on reaction time
        easiest_txt = "N/A"
        toughest_txt = "N/A"
        if reaction_times:
            best = min(reaction_times, key=lambda x: x[0])
            worst = max(reaction_times, key=lambda x: x[0])
            easiest_txt = f"Trial {best[1]}: '{best[2]}' ({best[0]}ms)"
            toughest_txt = f"Trial {worst[1]}: '{worst[2]}' ({worst[0]}ms)"

        # --- 4. MAP EVENTS ---
        new_events_list = []
        for annot in raw.annotations:
            clean_id = str(annot['description']).strip()
            sType = trial_type_map.get(clean_id, "Unknown")
            if sType == "Unknown": continue
            code = 1 if sType == 'R' else 2
            new_events_list.append([raw.time_as_index(annot['onset'])[0], 0, code])

        if not new_events_list:
            return {"error": "No matching events found in .exp file"}

        custom_events = np.array(new_events_list)
        event_ids = {'Target': 1, 'Non-Target': 2}

        # --- 5. FILTER & EPOCH ---
        # n_jobs=1 is safer for small cloud instances (prevents memory crashes)
        # Filter: 0.5Hz to 30Hz (Standard for P300)
        raw.filter(0.5, 30.0, picks='eeg', n_jobs=1, verbose=False) 
        
        # ARTIFACT REJECTION DICTIONARY
        reject_criteria = dict(eeg=100e-6)

        # Create epochs WITH artifact rejection
        epochs = mne.Epochs(
            raw, 
            custom_events, 
            event_ids, 
            tmin=-0.2, 
            tmax=0.6, 
            baseline=(None, 0), 
            picks='eeg', 
            reject=reject_criteria,
            preload=True, 
            verbose=False
        )
        
        # --- CALCULATE DROP STATS ---
        total_events = len(custom_events)
        good_epochs = len(epochs)
        dropped_epochs = total_events - good_epochs
        drop_percentage = (dropped_epochs / total_events) * 100 if total_events > 0 else 0

        # Check if we have enough trials left after rejection
        if len(epochs) == 0:
            return {"error": "All trials were rejected due to artifacts (too much noise)."}

        # Average the epochs to get the ERP
        evoked_target = epochs['Target'].average()
        evoked_nontarget = epochs['Non-Target'].average()

        # --- 6. PLOT REPORT (GRID LAYOUT) ---
        
        fig = plt.figure(figsize=(12, 32)) 
        
        gs = gridspec.GridSpec(7, 1, height_ratios=[1.2, 1.0, 2.5, 1.0, 2.5, 1.0, 2.5], hspace=0.5)

        # --- HEADER SECTION ---
        ax_header = fig.add_subplot(gs[0])
        ax_header.axis('off') 
        
        main_title = "Neuro-UX: B2B Dashboard Analysis"
        summary_text = (
            "B2B Dashboard Analysis Summary\n\n"
            "In this experiment, we replace standard images with screenshots of your dashboard (Current vs. New) "
            "to measure how easily users can make decisions. By giving a user a specific management task (e.g., 'Find the Revenue Drop'), "
            "the EEG acts as an unbiased stress test: the P100 shows us if the visual design is too busy, "
            "the N200 highlights exactly where users get confused by complex charts, and the P300 proves "
            "how much faster the new design allows them to spot the answer and act on it. "
            "This validates your design with hard biological data, not just opinions."
        )
        
        ax_header.text(0.5, 0.85, main_title, ha='center', fontsize=26, weight='bold', color='#2c3e50')
        ax_header.text(0.5, 0.45, textwrap.fill(summary_text, width=90), ha='center', va='top', fontsize=14, style='italic', color='#34495e')

        # Definitions for the 3 Sections
        sections = [
            {
                "comp": "P100", "ch": "OZ", "color": "green", "window": (0.08, 0.14),
                "title": "A. P100 (The 'Visual Impact' Test)", 
                "desc": "Measures how physically overwhelming the screen is—telling us if the visual elements are striking enough to register immediately."
            },
            {
                "comp": "N200", "ch": "FZ", "color": "yellow", "window": (0.20, 0.30),
                "title": "B. N200 (The 'Confusion' Test)",
                "desc": "Measures mental friction—revealing the exact moment a user gets stuck or frustrated because they can't instantly find the insight they need in a wall of numbers."
            },
            {
                "comp": "P300", "ch": "PZ", "color": "red", "window": (0.30, 0.50),
                "title": "C. P300 (The 'Confidence' Test)",
                "desc": "Measures the 'Aha!' moment—proving the user has successfully understood the data and is ready to make a confident decision, rather than hesitating."
            }
        ]
        
        row_indices = [(1, 2), (3, 4), (5, 6)] 
        
        # Init variable for the JSON response
        p300_score_txt = "N/A"

        for i, sec in enumerate(sections):
            text_row, graph_row = row_indices[i]
            channel = sec["ch"]
            
            # --- RENDER TEXT ROW ---
            ax_text = fig.add_subplot(gs[text_row])
            ax_text.axis('off') 
            
            # Title
            ax_text.text(0.5, 0.75, sec["title"], ha='center', fontsize=20, weight='bold', color='#2c3e50')
            # Description
            ax_text.text(0.5, 0.25, textwrap.fill(sec["desc"], width=100), ha='center', va='top', fontsize=14, color='#7f8c8d')

            # --- RENDER GRAPH ROW ---
            if channel in raw.ch_names:
                ax_graph = fig.add_subplot(gs[graph_row])
                
                # PLOT: Using MNE default scaling (Scientific Notation)
                mne.viz.plot_compare_evokeds(
                    {'Target': evoked_target, 'Non-Target': evoked_nontarget}, 
                    picks=channel, 
                    axes=ax_graph, 
                    show=False, 
                    show_sensors=False, 
                    legend='upper right',
                    title=None
                )
                
                # Highlight Time Window
                ax_graph.axvspan(sec["window"][0], sec["window"][1], color=sec["color"], alpha=0.15, label=f'{sec["comp"]} Window')
                
                # Styling: X-limits and Zero Line
                ax_graph.set_xlim(-0.2, 0.6)
                ax_graph.axhline(0, color='black', linewidth=0.5, linestyle='--', alpha=0.3)
                
                # Clean up borders
                ax_graph.spines['top'].set_visible(False)
                ax_graph.spines['right'].set_visible(False)
                ax_graph.grid(True, linestyle=':', alpha=0.4)
                ax_graph.set_ylabel("Amplitude (V)", fontsize=12, weight='bold') # Default is Volts
                ax_graph.set_xlabel("Time (s)", fontsize=12, weight='bold')
                
                # Add Label inside graph (UPDATED: Not bold, standard black)
                ax_graph.text(0.02, 0.98, f'{sec["comp"]} @ {channel}', 
                              transform=ax_graph.transAxes, 
                              fontsize=11, 
                              verticalalignment='top', 
                              bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
                              
                # --- SPECIAL LOGIC FOR P300 SCORE ---
                if sec["comp"] == "P300":
                    # 1. Get Data for Target condition
                    ch_idx = evoked_target.ch_names.index(channel)
                    data = evoked_target.data[ch_idx, :]
                    times = evoked_target.times
                    
                    # 2. Find Peak in WIDENED P300 Window (250ms - 600ms)
                    mask = (times >= 0.25) & (times <= 0.6)
                    
                    if np.any(mask):
                        window_data = data[mask]
                        window_times = times[mask]
                        
                        # Find index of max amplitude
                        peak_idx = np.argmax(window_data)
                        peak_latency_ms = window_times[peak_idx] * 1000
                        
                        # 3. Calculate Score (Adjusted Range)
                        min_lat = 250
                        max_lat = 600
                        raw_score = 100 - ((peak_latency_ms - min_lat) / (max_lat - min_lat) * 100)
                        score = max(0, min(100, raw_score))
                        p300_score_txt = f"{score:.0f}%"
                        
                        # 4. Add Score Box to Graph (UPDATED: Black text, not bold, neutral box)
                        score_text = (
                            f"P300 Latency: {peak_latency_ms:.0f} ms\n"
                            f"Neural Confidence Score: {p300_score_txt}"
                        )
                        ax_graph.text(0.98, 0.05, score_text, 
                                    transform=ax_graph.transAxes, 
                                    ha='right', va='bottom', fontsize=11,
                                    color='black',
                                    bbox=dict(boxstyle='round,pad=0.5', fc='white', ec='black', alpha=0.9))

                    # Add Research Footnote
                    ax_graph.text(0.5, -0.25, 
                                "* Research indicates that higher P300 latency directly correlates with slower task completion and lower user confidence.",
                                transform=ax_graph.transAxes, 
                                ha='center', fontsize=11, style='italic', color='#e74c3c')

            else:
                ax_graph = fig.add_subplot(gs[graph_row])
                ax_graph.text(0.5, 0.5, f'Channel {channel} not found', ha='center', fontsize=14, color='red')
                ax_graph.axis('off')

        # --- FOOTER METADATA ---
        target_count = len(epochs["Target"])
        nontarget_count = len(epochs["Non-Target"])
        balance_note = " ⚠️ Low trial count" if (target_count < 10 or nontarget_count < 10) else ""
        
        # Updated text to show Rejection stats
        footer_text = (
            f'Total Clean Epochs: {len(epochs)} (Target: {target_count} | Non-Target: {nontarget_count}){balance_note} | '
            f'Rejected: {dropped_epochs}/{total_events} ({drop_percentage:.1f}%) | Threshold: 100µV | Filter: 0.5-30Hz'
        )
        
        fig.text(0.5, 0.01, footer_text, ha='center', fontsize=10, style='italic', color='#7f8c8d')

        # --- 7. EXPORT ---
        buf = BytesIO()
        plt.savefig(buf, format="png", bbox_inches='tight', dpi=150) 
        plt.close(fig)
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode("utf-8")

        return {
            "status": "success", 
            "image": img_str,
            "easiest": easiest_txt,
            "toughest": toughest_txt,
            "neural_confidence_score": p300_score_txt, # Return this for frontend use if needed
            "metadata": {
                "total_events_found": total_events,
                "clean_epochs_kept": len(epochs),
                "rejected_epochs": dropped_epochs,
                "drop_percentage": round(drop_percentage, 2),
                "target_epochs": target_count,
                "nontarget_epochs": nontarget_count,
                "rejection_threshold": "100µV"
            }
        }

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR: {error_details}")
        return {"error": str(e), "details": error_details}
        
    finally:
        if 'tmp_cnt_path' in locals() and os.path.exists(tmp_cnt_path): 
            os.remove(tmp_cnt_path)
        if 'tmp_exp_path' in locals() and os.path.exists(tmp_exp_path): 
            os.remove(tmp_exp_path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)