import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from tqdm import tqdm
import os
import matplotlib.pyplot as plt

from model import get_tumor_model


def main():

    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    DATA_DIR = r"C:\ML\bbt\processed_dataset"
    SAVE_PATH = "tumor_model.pth"

    BATCH_SIZE = 32
    EPOCHS = 25
    LR = 1e-4
    PATIENCE = 5

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])

    train_data = datasets.ImageFolder(os.path.join(DATA_DIR, "train"), transform=transform)
    val_data = datasets.ImageFolder(os.path.join(DATA_DIR, "val"), transform=transform)

    train_loader = DataLoader(train_data, batch_size=BATCH_SIZE, shuffle=True, num_workers=6, pin_memory=True)
    val_loader = DataLoader(val_data, batch_size=BATCH_SIZE, shuffle=False, num_workers=6, pin_memory=True)

    print("Classes:", train_data.classes)

    model = get_tumor_model().to(DEVICE)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR)

    best_val_loss = float("inf")
    early_stop_counter = 0

    # ================= TRACKING =================
    train_losses = []
    val_losses = []
    train_accuracies = []
    val_accuracies = []

    for epoch in range(EPOCHS):

        # ===== TRAIN =====
        model.train()
        train_loss = 0
        correct = 0
        total = 0

        train_bar = tqdm(train_loader, desc=f"[Tumor] Epoch {epoch+1}/{EPOCHS}")

        for images, labels in train_bar:
            images, labels = images.to(DEVICE), labels.to(DEVICE)

            outputs = model(images)
            loss = criterion(outputs, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            train_loss += loss.item()

            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

            acc = 100 * correct / total

            train_bar.set_postfix(loss=f"{loss.item():.4f}", acc=f"{acc:.2f}%")

        train_loss /= len(train_loader)
        train_acc = 100 * correct / total

        # ===== VALIDATION =====
        model.eval()
        val_loss = 0
        correct = 0
        total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)

                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item()

                _, preds = torch.max(outputs, 1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)

        val_loss /= len(val_loader)
        val_acc = 100 * correct / total

        # ===== PRINT =====
        print("\n==============================")
        print(f"Epoch {epoch+1}/{EPOCHS}")
        print(f"Train Loss: {train_loss:.4f}")
        print(f"Train Accuracy: {train_acc:.2f}%")
        print(f"Val Loss: {val_loss:.4f}")
        print(f"Val Accuracy: {val_acc:.2f}%")

        # ===== SAVE BEST =====
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), SAVE_PATH)

            print("🔥🔥🔥 BEST MODEL SAVED 🔥🔥🔥")
            print(f"New Best Val Loss: {val_loss:.4f}")

            early_stop_counter = 0
        else:
            early_stop_counter += 1
            print(f"No improvement ({early_stop_counter}/{PATIENCE})")

        # ===== STORE METRICS =====
        train_losses.append(train_loss)
        val_losses.append(val_loss)
        train_accuracies.append(train_acc)
        val_accuracies.append(val_acc)

        # ===== EARLY STOP =====
        if early_stop_counter >= PATIENCE:
            print("⛔ EARLY STOPPING TRIGGERED")
            break

    # ===== PLOT =====
    os.makedirs("plots", exist_ok=True)

    plt.figure()
    plt.plot(train_losses, label="Train Loss")
    plt.plot(val_losses, label="Validation Loss")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend()
    plt.title("Loss Curve (New Model)")
    plt.savefig("plots/loss_curve_new_model.png")
    plt.show()

    plt.figure()
    plt.plot(train_accuracies, label="Train Accuracy")
    plt.plot(val_accuracies, label="Validation Accuracy")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.legend()
    plt.title("Accuracy Curve (New Model)")
    plt.savefig("plots/accuracy_curve_new_model.png")
    plt.show()

    print("\n✅ Training Complete")


if __name__ == "__main__":
    main()