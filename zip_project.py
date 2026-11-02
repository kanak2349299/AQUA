import os
import zipfile
import shutil

source_dir = r"C:\Users\rajni\.gemini\antigravity\scratch\aqua-watershed-twin"
downloads_dir = r"C:\Users\rajni\Downloads"
zip_output_path = os.path.join(downloads_dir, "AQUA_Project.zip")

exclude_dirs = {"node_modules", "dist", ".tmp", "__pycache__", ".git", ".venv", ".pytest_cache"}
exclude_extensions = {".pyc", ".pyo"}

print(f"Archiving {source_dir} to {zip_output_path}...")

with zipfile.ZipFile(zip_output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(source_dir):
        # Prune excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in exclude_extensions:
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, source_dir)
            zipf.write(full_path, arcname=os.path.join("AQUA", rel_path))

file_size_mb = os.path.getsize(zip_output_path) / (1024 * 1024)
print(f"Successfully generated {zip_output_path} ({file_size_mb:.2f} MB)")
