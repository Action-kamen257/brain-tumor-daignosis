# config.py

DATA_DIR = "processed_dataset"

BATCH_SIZE = 16
EPOCHS = 20
LR = 1e-4

NUM_CLASSES = 5  # Added not_mri

CLASS_NAMES = [
    "glioma",
    "meningioma",
    "no_tumor",
    "pituitary",
    "not_mri"
]

MODEL_NAME = "resnet50"
MODEL_SAVE_PATH = "best_model.pth"

LOG_DIR = "runs/brain_tumor_exp"

THRESHOLD = 0.60  # Confidence threshold for safety