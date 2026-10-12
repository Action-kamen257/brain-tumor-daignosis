from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import base64
from predict import predict_image

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("outputs/heatmap", exist_ok=True)


# ---------------- PREDICT ROUTE ----------------
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        result = predict_image(filepath)

        if result.get("status") == "invalid":
            return jsonify({
                "class": None,
                "confidence": 0,
                "heatmap": None,
                "error": result.get("message", "Invalid MRI image")
            })

        # Guard against unexpected result shapes
        if "prediction" not in result:
            return jsonify({"error": result.get("error", "Unexpected model output")}), 500

        return jsonify({
            "class": result["prediction"],
            "confidence": result["confidence"],
            "heatmap": f"outputs/heatmap/{file.filename}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- GRADCAM ROUTE ----------------
@app.route("/gradcam", methods=["POST"])
def gradcam():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        import time

        heatmap_path = os.path.join("outputs", "heatmap", file.filename)

        # Wait up to 8s for /predict to finish writing the heatmap
        for _ in range(16):
            if os.path.exists(heatmap_path):
                break
            time.sleep(0.5)

        if not os.path.exists(heatmap_path):
            return jsonify({"error": "Heatmap not yet available. Try again shortly."}), 404

        with open(heatmap_path, "rb") as f_heatmap:
            heatmap_b64 = base64.b64encode(f_heatmap.read()).decode("utf-8")

        return jsonify({
            "heatmap_base64": heatmap_b64
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- STATIC SERVE ----------------
@app.route("/outputs/<path:filename>")
def serve_output(filename):
    return send_from_directory("outputs", filename)


# ---------------- HEALTH CHECK ----------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "message": "NeuraScan backend is running"
    })


if __name__ == "__main__":
    app.run(port=8000, debug=True)