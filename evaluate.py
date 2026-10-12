import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import os

from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

from model import get_binary_model, get_tumor_model


def evaluate_model(model, loader, device):
    all_preds = []
    all_labels = []

    model.eval()
    with torch.no_grad():
        for images, labels in loader:
            images = images.to(device)

            outputs = model(images)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())

    acc = accuracy_score(all_labels, all_preds)

    return acc, all_labels, all_preds


def main():

    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    BATCH_SIZE = 32

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])

    # =======================
    # 🔹 BINARY MODEL
    # =======================

    binary_data_dir = r"C:\ML\bbt\binary_dataset"
    binary_model_path = "binary_model.pth"

    binary_val = datasets.ImageFolder(os.path.join(binary_data_dir, "val"), transform=transform)
    binary_loader = DataLoader(binary_val, batch_size=BATCH_SIZE, shuffle=False, num_workers=4, pin_memory=True)

    binary_classes = binary_val.classes

    binary_model = get_binary_model().to(DEVICE)
    binary_model.load_state_dict(torch.load(binary_model_path, map_location=DEVICE))

    print("\n================ BINARY MODEL ================")

    acc, labels, preds = evaluate_model(binary_model, binary_loader, DEVICE)

    print(f"Accuracy: {acc*100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(labels, preds, target_names=binary_classes))
    print("Confusion Matrix:")
    print(confusion_matrix(labels, preds))

    # =======================
    # 🔹 TUMOR MODEL
    # =======================

    tumor_data_dir = r"C:\ML\bbt\processed_dataset"
    tumor_model_path = "tumor_model.pth"

    tumor_val = datasets.ImageFolder(os.path.join(tumor_data_dir, "val"), transform=transform)
    tumor_loader = DataLoader(tumor_val, batch_size=BATCH_SIZE, shuffle=False, num_workers=4, pin_memory=True)

    tumor_classes = tumor_val.classes

    tumor_model = get_tumor_model().to(DEVICE)
    tumor_model.load_state_dict(torch.load(tumor_model_path, map_location=DEVICE))

    print("\n================ TUMOR MODEL ================")

    acc, labels, preds = evaluate_model(tumor_model, tumor_loader, DEVICE)

    print(f"Accuracy: {acc*100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(labels, preds, target_names=tumor_classes))
    print("Confusion Matrix:")
    print(confusion_matrix(labels, preds))


if __name__ == "__main__":
    main()