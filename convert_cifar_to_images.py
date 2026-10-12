import os
import pickle
import numpy as np
from PIL import Image

# Path to your CIFAR folder
CIFAR_PATH = r"C:\Users\SAMIR\Downloads\cifar-10-python\cifar-10-batches-py"
SAVE_PATH = r"C:\ML\bbt\processed_dataset\train\not_mri"

os.makedirs(SAVE_PATH, exist_ok=True)


def unpickle(file):
    with open(file, 'rb') as fo:
        dict = pickle.load(fo, encoding='bytes')
    return dict


image_count = 0

# Load all training batches
for i in range(1, 6):
    batch_file = os.path.join(CIFAR_PATH, f"data_batch_{i}")
    data_dict = unpickle(batch_file)

    images = data_dict[b'data']

    for img in images:
        img = img.reshape(3, 32, 32)
        img = np.transpose(img, (1, 2, 0))
        img = Image.fromarray(img)

        img.save(os.path.join(SAVE_PATH, f"not_mri_{image_count}.png"))
        image_count += 1

print(f"Saved {image_count} images to not_mri folder.")