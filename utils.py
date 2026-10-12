import torch
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader
from config import DATA_DIR, IMG_SIZE, BATCH_SIZE

def get_loaders():

    train_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
    ])

    val_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
    ])

    train_dataset = ImageFolder(
        root=f"{DATA_DIR}/train",
        transform=train_transform
    )

    val_dataset = ImageFolder(
        root=f"{DATA_DIR}/val",
        transform=val_transform
    )

    test_dataset = ImageFolder(
        root=f"{DATA_DIR}/test",
        transform=val_transform
    )

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE)

    return train_loader, val_loader, test_loader