import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from tqdm import tqdm
import os

from model import get_binary_model


def main():

    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    DATA_DIR = r"C:\ML\bbt\binary_dataset"

    BATCH_SIZE = 32
    EPOCHS = 20
    LR = 0.0001
    PATIENCE = 5

    SAVE_PATH = "binary_model.pth"

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])

    train_data = datasets.ImageFolder(os.path.join(DATA_DIR, "train"), transform=transform)
    val_data = datasets.ImageFolder(os.path.join(DATA_DIR, "val"), transform=transform)

    train_loader = DataLoader(train_data, batch_size=BATCH_SIZE, shuffle=True, num_workers=4, pin_memory=True)
    val_loader = DataLoader(val_data, batch_size=BATCH_SIZE, shuffle=False, num_workers=4, pin_memory=True)

    print("Classes:", train_data.classes)

    model = get_binary_model().to(DEVICE)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR)

    best_val_acc = 0
    patience_counter = 0

    for epoch in range(EPOCHS):

        print(f"\n========== Epoch {epoch+1}/{EPOCHS} ==========")

        # ===== TRAIN =====
        model.train()
        train_loss = 0
        correct = 0
        total = 0

        train_bar = tqdm(train_loader, desc="Training")

        for images, labels in train_bar:
            images, labels = images.to(DEVICE), labels.to(DEVICE)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()

            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_acc = correct / total
        train_loss /= len(train_loader)

        # ===== VALIDATION =====
        model.eval()
        correct = 0
        total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)

                outputs = model(images)
                _, preds = torch.max(outputs, 1)

                correct += (preds == labels).sum().item()
                total += labels.size(0)

        val_acc = correct / total

        # ===== PRINT CLEAN LOG =====
        print(f"Train Loss: {train_loss:.4f}")
        print(f"Train Accuracy: {train_acc*100:.2f}%")
        print(f"Validation Accuracy: {val_acc*100:.2f}%")

        # ===== SAVE BEST MODEL =====
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), SAVE_PATH)
            print(f"🔥 Best model saved (Val Acc: {val_acc*100:.2f}%)")
            patience_counter = 0
        else:
            patience_counter += 1

        # ===== EARLY STOPPING =====
        if patience_counter >= PATIENCE:
            print("⛔ Early stopping triggered")
            break


if __name__ == "__main__":
    main()