import os
import shutil

# ===== EDIT IF NEEDED =====
SOURCE_ROOT = r"C:\ML\bbt\processed_dataset"
TARGET_ROOT = r"C:\ML\bbt\binary_dataset"
# ==========================

MRI_CLASSES = ['glioma', 'meningioma', 'no_tumor', 'pituitary']
NOT_MRI_CLASS = 'not_mri'
SPLITS = ['train', 'val', 'test']


def copy_images(src_folder, dest_folder):
    os.makedirs(dest_folder, exist_ok=True)

    for file in os.listdir(src_folder):
        src_path = os.path.join(src_folder, file)
        dest_path = os.path.join(dest_folder, file)

        if os.path.isfile(src_path):
            shutil.copy2(src_path, dest_path)


def move_folder(src_folder, dest_folder):
    if os.path.exists(src_folder):
        if os.path.exists(dest_folder):
            shutil.rmtree(dest_folder)

        shutil.move(src_folder, dest_folder)


def build_binary_dataset():

    if not os.path.exists(SOURCE_ROOT):
        print("❌ SOURCE_ROOT not found.")
        return

    for split in SPLITS:

        print(f"\nProcessing {split} set...")

        split_source = os.path.join(SOURCE_ROOT, split)
        split_target = os.path.join(TARGET_ROOT, split)

        mri_target = os.path.join(split_target, "mri")
        not_mri_target = os.path.join(split_target, "not_mri")

        os.makedirs(mri_target, exist_ok=True)

        # 1️⃣ COPY MRI classes
        for cls in MRI_CLASSES:
            class_folder = os.path.join(split_source, cls)

            if os.path.exists(class_folder):
                print(f"Copying {cls} → mri")
                copy_images(class_folder, mri_target)
            else:
                print(f"⚠️ {cls} not found in {split}")

        # 2️⃣ MOVE not_mri folder
        not_mri_source = os.path.join(split_source, NOT_MRI_CLASS)

        if os.path.exists(not_mri_source):
            print("Moving not_mri folder")
            move_folder(not_mri_source, not_mri_target)
        else:
            print(f"⚠️ not_mri not found in {split}")

    print("\n✅ Binary dataset created successfully.")
    print("⚠️ not_mri folders have been MOVED from processed_dataset.")


if __name__ == "__main__":
    build_binary_dataset()