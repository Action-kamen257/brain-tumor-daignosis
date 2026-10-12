import os
import shutil
import hashlib
import random
from collections import defaultdict
from tqdm import tqdm

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(BASE_DIR, "raw_dataset")
OUTPUT_DIR = os.path.join(BASE_DIR, "processed_dataset")

VALID_EXTENSIONS = (".jpg", ".jpeg", ".png")

TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15
RANDOM_SEED = 42

random.seed(RANDOM_SEED)


def is_valid_image(filename):
    if filename.startswith("."):
        return False
    if filename.startswith(".__"):
        return False
    if filename.endswith("_mask.png"):
        return False
    if not filename.lower().endswith(VALID_EXTENSIONS):
        return False
    return True


def get_hash(path):
    try:
        with open(path, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None


def collect_unique_images():
    print("\nCollecting and deduplicating images from raw_dataset...")

    hash_seen = set()
    class_images = defaultdict(list)

    for cls in os.listdir(RAW_DIR):
        cls_path = os.path.join(RAW_DIR, cls)
        if not os.path.isdir(cls_path):
            continue

        for img in tqdm(os.listdir(cls_path), desc=f"Scanning {cls}"):
            if not is_valid_image(img):
                continue

            img_path = os.path.join(cls_path, img)
            file_hash = get_hash(img_path)

            if file_hash and file_hash not in hash_seen:
                hash_seen.add(file_hash)
                class_images[cls].append(img_path)

    return class_images


def create_output_structure(classes):
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)

    for split in ["train", "val", "test"]:
        for cls in classes:
            os.makedirs(os.path.join(OUTPUT_DIR, split, cls))


def stratified_split_and_copy(class_images):
    print("\nPerforming stratified 70/15/15 split...")

    for cls, images in class_images.items():
        random.shuffle(images)

        total = len(images)
        train_end = int(total * TRAIN_RATIO)
        val_end = int(total * (TRAIN_RATIO + VAL_RATIO))

        train_imgs = images[:train_end]
        val_imgs = images[train_end:val_end]
        test_imgs = images[val_end:]

        print(f"\nClass: {cls}")
        print(f"Total unique: {total}")
        print(f"Train: {len(train_imgs)}")
        print(f"Val: {len(val_imgs)}")
        print(f"Test: {len(test_imgs)}")

        for img in tqdm(train_imgs, desc=f"{cls} train"):
            shutil.copy(img, os.path.join(OUTPUT_DIR, "train", cls))

        for img in tqdm(val_imgs, desc=f"{cls} val"):
            shutil.copy(img, os.path.join(OUTPUT_DIR, "val", cls))

        for img in tqdm(test_imgs, desc=f"{cls} test"):
            shutil.copy(img, os.path.join(OUTPUT_DIR, "test", cls))


def main():
    print("\n========== SAFE CLEAN REBUILD ==========")

    class_images = collect_unique_images()

    print("\nUnique image counts:")
    for cls in class_images:
        print(cls, len(class_images[cls]))

    create_output_structure(class_images.keys())
    stratified_split_and_copy(class_images)

    print("\nDataset successfully rebuilt inside processed_dataset.")
    print("raw_dataset remains untouched.")


if __name__ == "__main__":
    main()