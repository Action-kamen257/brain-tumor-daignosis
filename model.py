import torch.nn as nn
from torchvision import models


def get_binary_model():
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

    model.fc = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(model.fc.in_features, 2)
    )

    return model


def get_tumor_model():
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)

    model.fc = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(model.fc.in_features, 4)
    )

    return model