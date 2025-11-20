import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mne
import matplotlib.pyplot as plt
import numpy as np
import tempfile
import os
import base64
import textwrap
from io import BytesIO

app = FastAPI()

# Allow Lovable to talk to this server
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
async def analyze_eeg(cnt_file: UploadFile = File(...), exp_file: UploadFile = File(...)):
    # 1. SAVE UPLOADS TEMP
    with tempfile.NamedTemporaryFile(delete=False, suffix=".cnt") as tmp_cnt:
        tmp_cnt.write(await cnt_file.read())
        tmp_cnt_path = tmp_cnt.name

    with tempfile.NamedTemporaryFile(delete=False, suffix=".exp") as tmp_exp:
        tmp_exp.write(await exp_file.read())
        tmp_exp_path = tmp_exp.name

    try:
        # 2. LOAD DATA
        raw = mne.io.read_raw_cnt(tmp_cnt_path, preload=True, verbose=False)
        
        # 3. PARSE EXP
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

        # Frontend Text Logic
        easiest_txt = "N/A"
        toughest_txt = "N/A"
        if reaction_times:
            reaction_times.sort()
            best = reaction_times[0]
            easiest_txt = f"Trial {best[1]}: '{best[2]}' ({best[0]}ms)"
            worst = reaction_times[-1]
            toughest_txt = f"Trial {worst[1]}: '{worst[2]}' ({worst[0]}ms)"

        # 4. EVENTS
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

        # 5. FILTER & EPOCH
        raw.filter(0.1, 30.0, picks='eeg', verbose=False)
        epochs = mne.Epochs(raw, custom_events, event_ids, tmin=-0.2, tmax=0.6, baseline=(None, 0), picks='eeg', preload=True, verbose=False)
        
        evoked_target = epochs['Target'].average()
        evoked_nontarget = epochs['Non-Target'].average()

        # 6. PLOT (REPORT STYLE - FIXED SPACING)
        
        # ### LAYOUT CONTROL: CANVAS HEIGHT ###
        # figsize=(12, 30):
        # - 12 is width (standard)
        # - 30 is HEIGHT. Increase this (e.g., to 35 or 40) if you need more vertical room.
        fig, ax = plt.subplots(3, 1, figsize=(12, 30))
        
        # --- MAIN HEADER ---
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
        
        # Place Header at absolute top
        fig.text(0.5, 0.97, main_title, ha='center', fontsize=24, weight='bold', color='#2c3e50')
        fig.text(0.5, 0.93, textwrap.fill(summary_text, width=95), ha='center', va='top', fontsize=13, style='italic', color='#34495e')

        # Definitions
        sections = [
            {
                "comp": "P100",
                "ch": "OZ",
                "title": "A. P100 (The 'First Glance' Test)",
                "desc": "Measures how physically overwhelming the screen is—telling us if the sheer amount of clutter is tiring the user's eyes before they even start reading.",
                "window": (0.08, 0.14),
                "color": "green"
            },
            {
                "comp": "N200",
                "ch": "FZ",
                "title": "B. N200 (The 'Confusion' Test)",
                "desc": "Measures mental friction—revealing the exact moment a user gets stuck or frustrated because they can’t instantly find the insight they need in a wall of numbers.",
                "window": (0.20, 0.30),
                "color": "yellow"
            },
            {
                "comp": "P300",
                "ch": "PZ",
                "title": "C. P300 (The 'Confidence' Test)",
                "desc": "Measures the 'Aha!' moment—proving the user has successfully understood the data and is ready to make a confident decision, rather than hesitating.",
                "window": (0.30, 0.50),
                "color": "red"
            }
        ]
        
        for i, sec in enumerate(sections):
            channel = sec["ch"]
            
            if channel in raw.ch_names:
                # Plot Graph
                mne.viz.plot_compare_evokeds(
                    {'Target': evoked_target, 'Non-Target': evoked_nontarget}, 
                    picks=channel, 
                    axes=ax[i], 
                    show=False, 
                    show_sensors=False, 
                    legend='upper right' if i == 0 else None,
                    title=None
                )
                
                # Highlight Window
                ax[i].axvspan(sec["window"][0], sec["window"][1], color=sec["color"], alpha=0.1, label=f"{sec['comp']} Window")
                
                # --- TEXT BOXES (FIXED POSITIONS) ---
                
                # ### LAYOUT CONTROL: TITLE POSITION ###
                # '1.4' means 140% of the graph height. 
                # Increase to 1.5 or 1.6 to push title HIGHER.
                ax[i].text(0.5, 1.4, sec["title"], 
                         transform=ax[i].transAxes, 
                         ha='center', va='bottom', 
                         fontsize=18, weight='bold', color='#2c3e50')
                
                # ### LAYOUT CONTROL: DESCRIPTION POSITION ###
                # '1.15' means 115% of the graph height.
                # Increase to 1.2 or 1.3 to push description HIGHER.
                wrapped_desc = textwrap.fill(sec["desc"], width=85)
                ax[i].text(0.5, 1.15, wrapped_desc, 
                         transform=ax[i].transAxes, 
                         ha='center', va='top', 
                         fontsize=12, color='#7f8c8d',
                         bbox=dict(boxstyle="round,pad=0.5", fc="white", ec="#bdc3c7", alpha=0.8))

        # ADJUST LAYOUT
        # ### LAYOUT CONTROL: VERTICAL SPACING ###
        # 'hspace=0.8' adds the white gap between graphs. 
        # Increase to 1.0 or 1.2 if the text is still overlapping the graph above it.
        plt.subplots_adjust(top=0.88, hspace=0.8, bottom=0.05)
        
        # 7. CONVERT TO IMAGE
        buf = BytesIO()
        # dpi=150 ensures crisp text
        plt.savefig(buf, format="png", bbox_inches='tight', dpi=150) 
        plt.close(fig)
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode("utf-8")

        return {
            "status": "success", 
            "image": img_str,
            "easiest": easiest_txt,
            "toughest": toughest_txt
        }

    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(tmp_cnt_path): os.remove(tmp_cnt_path)
        if os.path.exists(tmp_exp_path): os.remove(tmp_exp_path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)