import os
import random
import shutil

BASE_PATH = r"C:\ML\bbt\processed_dataset"
SOURCE = os.path.join(BASE_PATH, "train", "not_mri")

TRAIN_TARGET = os.path.join(BASE_PATH, "train", "not_mri")
VAL_TARGET = os.path.join(BASE_PATH, "val", "not_mri")
TEST_TARGET = os.path.join(BASE_PATH, "test", "not_mri")

os.makedirs(VAL_TARGET, exist_ok=True)
os.makedirs(TEST_TARGET, exist_ok=True)

images = os.listdir(SOURCE)
random.shuffle(images)

train_count = 8000
val_count = 1000
test_count = 1000

# Move validation images
for img in images[train_count:train_count+val_count]:
    shutil.move(os.path.join(SOURCE, img),
                os.path.join(VAL_TARGET, img))

# Move test images
for img in images[train_count+val_count:train_count+val_count+test_count]:
    shutil.move(os.path.join(SOURCE, img),
                os.path.join(TEST_TARGET, img))

# Delete remaining extra images
remaining = os.listdir(SOURCE)
for img in remaining[train_count:]:
    os.remove(os.path.join(SOURCE, img))

print("Dataset split completed.")
print("Train: 3000 | Val: 500 | Test: 500")