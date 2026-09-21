# 🛡️ TruthShield

### AI-Powered Fake News Detection Platform

TruthShield is a web-based fake news detection system designed to help users assess the credibility of news content using **machine learning, natural language processing, OCR, and AI-assisted analysis**.

🌐 **Live Demo:** https://truthshield-tfr3.onrender.com

---

## ✨ Features

* 📰 **News Text Analysis** — Analyze news content directly by entering text.
* 🔗 **URL Analysis** — Submit a news article URL and extract its content for analysis.
* 🖼️ **Image Analysis** — Upload an image containing news content and extract text using OCR.
* 🤖 **Machine Learning Detection** — Uses trained text-classification models to identify patterns associated with real and potentially fake news.
* 🧠 **AI-Assisted Analysis** — Provides additional analysis of the submitted content using an AI model.
* 📊 **Confidence-Based Results** — Presents model outputs to help users interpret the analysis.
* 🌐 **Web Interface** — Responsive dark-themed interface designed for desktop and mobile use.
* 🔄 **Model Retraining** — Supports retraining the classification models through the backend.

---

## 🧠 How It Works

TruthShield processes information through the following pipeline:

```text
User Input
    │
    ├── News Text
    ├── Article URL
    └── Image
          │
          ▼
     Content Extraction
          │
          ▼
   Text Preprocessing
          │
          ▼
 ┌───────────────────────┐
 │ Machine Learning      │
 │ • SGD Classifier      │
 │ • Passive Aggressive  │
 │   Classifier          │
 └───────────────────────┘
          │
          ▼
    Classification
          │
          ├──────────────► AI-Assisted Analysis
          │
          ▼
      Final Results
```

For image-based input, OCR is performed before the extracted text is passed through the analysis pipeline.

---

## 🛠️ Tech Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Frontend         | HTML, CSS, JavaScript              |
| Backend          | Python, Flask                      |
| Machine Learning | Scikit-learn                       |
| NLP              | Text preprocessing & vectorization |
| OCR              | EasyOCR, OpenCV                    |
| AI Analysis      | Groq                               |
| Database         | MySQL                              |
| Deployment       | Render                             |

---

## 📂 Project Structure

```text
Truthshield/
│
├── app.py
├── utils.py
├── requirements.txt
│
├── static/
│   ├── index.html
│   ├── Home.html
│   ├── About.html
│   └── ...
│
├── models/
│   └── ...
│
├── Uploads/
│   └── ...
│
└── ...
```

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/HomieTal/Truthshield.git
cd Truthshield
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Linux/macOS:

```bash
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file and add the required API credentials used by the application.

**Never commit API keys or other secrets to GitHub.**

### 5. Start the application

```bash
python app.py --api
```

The Flask server runs on:

```text
http://localhost:4000
```

---

## 🔌 API

### Analyze Content

```http
POST /api/analyze
```

The endpoint accepts:

* `text` — News text
* `url` — Article URL
* `image` — Image containing news content
* `include_ai` — Whether to include AI-assisted analysis

Example:

```bash
curl -X POST http://localhost:4000/api/analyze \
  -F "text=Your news article text here" \
  -F "include_ai=true"
```

### Retrain Models

```http
POST /api/retrain
```

This endpoint retrains the machine-learning models using the project's training pipeline.

---

## 🔐 Security

TruthShield is designed so that sensitive API credentials should remain on the server side.

Recommended practices:

* Store API keys in environment variables.
* Never expose API keys in frontend JavaScript.
* Never commit `.env` files.
* Validate uploaded files before processing.
* Sanitize uploaded filenames.
* Restrict allowed file types.

---

## ⚠️ Limitations

TruthShield is an **assistive detection tool, not a definitive fact-checker**.

Machine-learning predictions can be incorrect, especially when dealing with:

* Satire or parody
* Opinions and commentary
* Very short articles
* Breaking news
* Unusual writing styles
* Claims with insufficient context
* Information that has changed since the model was trained

A prediction should therefore **not be treated as proof that a news story is true or false**.

Always verify important claims using multiple reliable and independent sources.

---

## 🔮 Future Improvements

Potential future enhancements include:

* 🌐 Real-time verification against trusted news sources
* 🔎 Source credibility analysis
* 📚 Larger and more diverse training datasets
* 🌍 Multilingual fake-news detection
* 🧩 Explainable AI with highlighted evidence
* 🎯 Improved confidence calibration
* 📈 Model performance monitoring
* 🔐 Stronger API security and rate limiting
* 🧠 More advanced transformer-based NLP models
* 🧪 Automated testing and evaluation pipelines

---

## 🎯 Project Goal

The goal of TruthShield is to make news analysis more accessible by combining traditional machine learning with modern AI techniques in a simple web application.

> **Think critically. Verify independently. Don't blindly trust a prediction.**

---

## 📜 Disclaimer

TruthShield is an experimental/educational project intended to assist with information analysis.

The results generated by the system may contain errors and should not be considered authoritative fact-checking. Users should independently verify important information through reliable sources.

---

## 👨‍💻 Author

**Arjun Santhosh E N**

B.Tech Computer Science & Engineering

---

## ⭐ Support

If you find the project useful, consider giving the repository a ⭐ on GitHub.

**GitHub:** https://github.com/HomieTal/Truthshield

**Live Demo:** https://truthshield-tfr3.onrender.com
