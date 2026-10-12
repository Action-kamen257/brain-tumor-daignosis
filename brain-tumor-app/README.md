# 🧠 NeuraScan — Brain Tumor Detection System

A production-ready web application for AI-powered brain tumor detection from MRI scans, featuring Grad-CAM visualization.

---

## 📁 Project Structure

```
brain-tumor-app/
│
├── src/                        # React frontend
│   ├── api/index.js            # Axios API layer
│   ├── components/
│   │   ├── GradCamViewer.jsx   # Heatmap viewer with opacity slider
│   │   ├── HistoryPanel.jsx    # Slide-over scan history
│   │   ├── Navbar.jsx          # Top navigation
│   │   ├── NeuralBackground.jsx# Animated background
│   │   └── Spinner.jsx         # Loading animations
│   ├── hooks/
│   │   └── useHistory.js       # LocalStorage history hook
│   ├── pages/
│   │   ├── LandingPage.jsx     # Hero + features + CTA
│   │   ├── ScanPage.jsx        # Upload + drag-drop
│   │   ├── ResultsPage.jsx     # Diagnosis + Grad-CAM display
│   │   └── AboutPage.jsx       # Model info + pipeline
│   ├── utils/index.js          # Helpers (formatting, canvas blend)
│   ├── App.jsx                 # Router
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind + custom styles
│
├── app.py                      # Flask backend (updated with /gradcam + CORS)
├── requirements.txt            # Python dependencies
├── package.json                # Node dependencies
├── vite.config.js              # Vite + proxy config
├── tailwind.config.js
└── postcss.config.js
```

---

## ⚙️ Setup & Run

### 1. Backend (Python / Flask)

```bash
# From your project root (where app.py, predict.py etc. live)
pip install -r requirements.txt

# Copy the updated app.py into your project root
# (replaces the original — adds CORS + /gradcam endpoint)

python app.py
# Server runs on http://localhost:8000
```

> **Note:** Copy `app.py` from this folder into your existing `sample/` project root, alongside `predict.py`, `gradcam.py`, etc.

---

### 2. Frontend (React / Vite)

```bash
# From the brain-tumor-app/ directory
npm install
npm run dev
# Opens on http://localhost:3000
```

---

## 🔌 API Endpoints (Backend)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/predict` | Runs binary + tumor classification. Returns `class`, `confidence`, `heatmap` path |
| POST | `/gradcam` | Returns Grad-CAM heatmap as base64 PNG |
| GET | `/outputs/<path>` | Serves static heatmap files |
| GET | `/health` | Health check |

### Example request
```js
const form = new FormData()
form.append('file', imageFile)
const res = await fetch('http://localhost:8000/predict', { method: 'POST', body: form })
const data = await res.json()
// { class: 'glioma', confidence: 94.2, heatmap: 'outputs/heatmap/mri.jpg' }
```

---

## 🎨 Features

- **Landing page** — animated hero, feature cards, tumor type overview
- **Drag & drop upload** — with file preview and validation
- **Real-time analysis** — animated step-by-step processing spinner
- **Results page** — diagnosis card, confidence bar, severity badge
- **Grad-CAM viewer** — original / heatmap / overlay tabs with opacity slider
- **Download button** — save current view as PNG
- **Scan history** — last 10 scans stored in localStorage
- **About page** — pipeline diagram, model architecture, Grad-CAM explanation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Animations | Framer Motion |
| Routing | React Router v6 |
| HTTP | Axios |
| File input | React Dropzone |
| Toasts | React Hot Toast |
| Backend | Flask, PyTorch, OpenCV |
| Models | ResNet-18 (binary), ResNet-50 (tumor) |
| Explainability | Grad-CAM |

---

## ⚠️ Disclaimer

This project is for **educational and research purposes only**. It is not a certified medical device and must not be used for clinical diagnosis. Always consult a qualified radiologist.
