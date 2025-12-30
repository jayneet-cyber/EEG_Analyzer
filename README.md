# EEG Analyzer

A full-stack web application for analyzing EEG (Electroencephalography) data to assess cognitive load, developed as part of a Master's Thesis project. The application provides an intuitive interface for uploading EEG files, processing them through a neuroscience pipeline, and visualizing key event-related potentials (ERPs) such as P100, N200, and P300 components.

## Features

- **File Upload**: Secure upload of raw EEG data (.cnt files) and experiment logs (.exp files)
- **Data Processing Pipeline**:
  - Bandpass filtering (0.1–30 Hz)
  - Epoching based on experiment logs
  - Grand Average ERP computation
- **Visualization**: Interactive plots for P100 (Visual), N200 (Categorization), and P300 (Decision/Attention) components
- **Web Interface**: Modern React-based frontend with responsive design
- **API Backend**: FastAPI-powered REST API for data processing
- **Containerized Deployment**: Docker and Docker Compose setup for easy deployment

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Neuroscience Library**: MNE-Python
- **Data Processing**: NumPy, SciPy
- **Visualization**: Matplotlib
- **Language**: Python 3.x

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Custom components with Tailwind CSS
- **State Management**: React hooks
- **Deployment**: Nginx

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (frontend)

## Project Structure

```
EEG_Analyzer/
├── main.py                 # FastAPI backend application
├── requirements.txt        # Python dependencies
├── Dockerfile              # Backend container configuration
├── docker-compose.yml      # Multi-service orchestration
├── frontend/
│   ├── src/
│   │   ├── components/     # React components (FileUpload, ResultsDisplay, etc.)
│   │   ├── App.tsx         # Main React application
│   │   └── main.tsx        # Application entry point
│   ├── Dockerfile          # Frontend container configuration
│   ├── nginx.conf          # Nginx configuration
│   └── package.json        # Node.js dependencies
└── README.md
```

## Installation & Setup

### Prerequisites
- Docker and Docker Compose
- Git

### Quick Start
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd EEG_Analyzer
   ```

2. Start the application:
   ```bash
   docker-compose up --build
   ```

3. Open your browser and navigate to `http://localhost`

### Development Setup

#### Backend
1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend:
   ```bash
   python main.py
   ```

#### Frontend
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Upload Files**: Use the web interface to upload your .cnt EEG file and .exp experiment log file
2. **Process Data**: The backend automatically processes the data through the neuroscience pipeline
3. **View Results**: Interactive visualizations of ERPs are displayed on the results page
4. **Download Reports**: Export processed data and visualizations as needed

## API Documentation

The backend provides REST API endpoints for:
- File upload (`POST /upload`)
- Data processing status (`GET /status/{task_id}`)
- Results retrieval (`GET /results/{task_id}`)

## Contributing

This project is developed as part of a Master's Thesis. For contributions or questions, please contact the project maintainer.

## License

[Add appropriate license information]

## Acknowledgments

- Built with MNE-Python for EEG analysis
- Frontend components inspired by modern web design patterns
- Part of Master's Thesis research on cognitive load assessment
