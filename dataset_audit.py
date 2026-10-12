import os
import hashlib
from collections import defaultdict
from tqdm import tqdm

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SPLITS = ["train", "val", "test"]
VALID_EXTENSIONS = (".jpg", ".jpeg", ".png")


def is_valid_image(filename):
    if filename.startswith(".__"):
        return False
    if filename.startswith("."):
        return False
    if filename.endswith("_mask.png"):
        return False
    if not filename.lower().endswith(VALID_EXTENSIONS):
        return False
    return True


def get_hash(file_path):
    try:
        with open(file_path, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None


def get_all_images():
    all_images = []

    for split in SPLITS:
        split_path = os.path.join(BASE_DIR, split)
        if not os.path.exists(split_path):
            continue

        for cls in os.listdir(split_path):
            cls_path = os.path.join(split_path, cls)
            if not os.path.isdir(cls_path):
                continue

            for img in os.listdir(cls_path):
                if not is_valid_image(img):
                    continue

                img_path = os.path.join(cls_path, img)
                all_images.append((split, cls, img_path))

    return all_images


def count_images():
    print("\n========== IMAGE COUNTS ==========")

    for split in SPLITS:
        split_path = os.path.join(BASE_DIR, split)
        if not os.path.exists(split_path):
            continue

        print(f"\n{split.upper()}")

        for cls in os.listdir(split_path):
            cls_path = os.path.join(split_path, cls)
            if not os.path.isdir(cls_path):
                continue

            count = 0
            for f in os.listdir(cls_path):
                if is_valid_image(f):
                    count += 1

            print(f"{cls}: {count}")


def audit_dataset():
    print("\n========== STARTING DATASET AUDIT ==========")

    all_images = get_all_images()
    print(f"Total valid images found: {len(all_images)}")

    hash_map = defaultdict(list)
    split_hashes = {"train": set(), "val": set(), "test": set()}

    print("\nHashing images...")

    for split, cls, img_path in tqdm(all_images):
        file_hash = get_hash(img_path)
        if file_hash:
            hash_map[file_hash].append(img_path)
            split_hashes[split].add(file_hash)

    print("\n========== CROSS-SPLIT LEAKAGE ==========")
    print("Train-Val overlap:", len(split_hashes["train"] & split_hashes["val"]))
    print("Train-Test overlap:", len(split_hashes["train"] & split_hashes["test"]))
    print("Val-Test overlap:", len(split_hashes["val"] & split_hashes["test"]))

    duplicates = [v for v in hash_map.values() if len(v) > 1]

    print("\n========== DUPLICATES ==========")
    print("Duplicate groups found:", len(duplicates))


if __name__ == "__main__":
    count_images()
    audit_dataset()