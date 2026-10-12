import os
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from tqdm import tqdm
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# =========================
# CONFIG
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "processed_dataset", "train")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
IMAGE_SIZE = 224
OUTLIER_PERCENT = 5  # bottom 5% will be flagged

print("Using device:", DEVICE)

# =========================
# MODEL (Feature Extractor)
# =========================

model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
model.fc = torch.nn.Identity()  # remove classifier
model = model.to(DEVICE)
model.eval()

# =========================
# TRANSFORM
# =========================

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
])

def extract_embedding(img_path):
    try:
        img = Image.open(img_path).convert("RGB")
        img = transform(img).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            embedding = model(img)
        return embedding.cpu().numpy().flatten()
    except:
        return None

# =========================
# MAIN LOGIC
# =========================

print("\nExtracting embeddings...")

embeddings = {}
paths = {}

for cls in os.listdir(DATA_DIR):
    cls_path = os.path.join(DATA_DIR, cls)
    if not os.path.isdir(cls_path):
        continue

    embeddings[cls] = []
    paths[cls] = []

    for img in tqdm(os.listdir(cls_path), desc=f"Embedding {cls}"):
        img_path = os.path.join(cls_path, img)
        emb = extract_embedding(img_path)
        if emb is not None:
            embeddings[cls].append(emb)
            paths[cls].append(img_path)

# =========================
# OUTLIER DETECTION
# =========================

print("\n========== LABEL NOISE ANALYSIS ==========")

for cls in embeddings:
    embs = np.array(embeddings[cls])
    sim_matrix = cosine_similarity(embs)
    avg_similarity = sim_matrix.mean(axis=1)

    threshold = np.percentile(avg_similarity, OUTLIER_PERCENT)

    print(f"\nClass: {cls}")
    print(f"Total images: {len(paths[cls])}")
    print(f"Flagging bottom {OUTLIER_PERCENT}% as suspicious")

    suspicious = []

    for i, score in enumerate(avg_similarity):
        if score < threshold:
            suspicious.append(paths[cls][i])

    print(f"Suspicious images found: {len(suspicious)}")

    for s in suspicious[:20]:  # show only first 20
        print(s)

print("\nDone. Review suspicious images manually.")