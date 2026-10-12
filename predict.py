import torch
import torch.nn.functional as F
import cv2
import os
from torchvision import transforms
from model import get_binary_model, get_tumor_model
from gradcam import generate_gradcam, overlay_heatmap
from PIL import Image

# ---------------- DEVICE ----------------
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------------- LOAD MODELS ----------------
binary_model = get_binary_model().to(DEVICE)
binary_model.load_state_dict(torch.load("binary_model.pth", map_location=DEVICE))
binary_model.eval()

tumor_model = get_tumor_model().to(DEVICE)
tumor_model.load_state_dict(torch.load("tumor_model.pth", map_location=DEVICE))
tumor_model.eval()

# ---------------- TRANSFORM ----------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ---------------- OUTPUT FOLDERS ----------------
os.makedirs("outputs/heatmap", exist_ok=True)

# ---------------- LABEL MAPS ----------------
BINARY_CLASSES = ["mri", "not_mri"]
TUMOR_CLASSES = ["glioma", "meningioma", "no_tumor", "pituitary"]


# ---------------- MAIN FUNCTION ----------------
def predict_image(image_path):
    filename = os.path.basename(image_path)

    # ---------- LOAD IMAGE ----------
    original = cv2.imread(image_path)
    if original is None:
        return {
            "status": "invalid",
            "message": "Could not read image file. Ensure it is a valid JPG or PNG.",
            "confidence": 0
        }

    image_rgb = cv2.cvtColor(original, cv2.COLOR_BGR2RGB)
    image_pil = Image.fromarray(image_rgb)

    # ---------- PREPROCESS ----------
    image_tensor = transform(image_pil).unsqueeze(0).to(DEVICE)

    # ---------- BINARY PREDICTION ----------
    with torch.no_grad():
        binary_out = binary_model(image_tensor)
        binary_probs = F.softmax(binary_out, dim=1)
        binary_conf, binary_pred = torch.max(binary_probs, 1)

    binary_class = BINARY_CLASSES[binary_pred.item()]
    binary_conf = binary_conf.item()

    # ❌ NOT MRI → STOP HERE
    if binary_class == "not_mri" or binary_conf < 0.7:
        return {
            "status": "invalid",
            "message": "Uploaded image is not a valid MRI scan",
            "confidence": round(binary_conf * 100, 2)
        }

    # ---------- TUMOR PREDICTION ----------
    with torch.no_grad():
        tumor_out = tumor_model(image_tensor)
        tumor_probs = F.softmax(tumor_out, dim=1)
        tumor_conf, tumor_pred = torch.max(tumor_probs, 1)

    tumor_class = TUMOR_CLASSES[tumor_pred.item()]
    tumor_conf = tumor_conf.item()

    # ---------- GRAD-CAM ----------
    cam = generate_gradcam(tumor_model, image_tensor, tumor_pred.item())
    overlay = overlay_heatmap(original, cam)

    heatmap_path = f"outputs/heatmap/{filename}"
    cv2.imwrite(heatmap_path, overlay)

    # ---------- RESPONSE ----------
    return {
        "status": "success",
        "prediction": tumor_class,
        "confidence": round(tumor_conf * 100, 2),
        "binary_confidence": round(binary_conf * 100, 2),
        "heatmap_path": heatmap_path
    }