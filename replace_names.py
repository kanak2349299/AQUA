import os
import re

base_dir = r"C:\Users\rajni\.gemini\antigravity\scratch\aqua-watershed-twin"
exclude_dirs = {"node_modules", "dist", ".tmp", "__pycache__", ".git", ".venv"}

replacements = [
    # Project Name replacements
    ("AQUA AI", "AQUA AI"),
    ("AQUA", "AQUA"),
    ("aqua", "aqua"),
    ("AQUA", "AQUA"),
    
    # Team members name removals from dashboard/UI
    ("Water Resources Division", "Water Resources Division"),
    ("National Water Resources Directorate", "National Water Resources Directorate"),
    ("National Water Intelligence Initiative", "National Water Intelligence Initiative"),
    ("National Water Resources Directorate", "National Water Resources Directorate"),
    ("Groundwater Assessment Directorate", "Groundwater Assessment Directorate"),
    ("District Water Resources Officer", "District Water Resources Officer"),
    ("officer@cgwb.gov.in", "officer@cgwb.gov.in"),
    ("Water Officer", "Water Officer"),
    ("Hydrologist", "Hydrologist"),
    ("Water Resources Directorate", "Water Resources Directorate")
]

modified_files = []

for root, dirs, files in os.walk(base_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith((".tsx", ".ts", ".py", ".html", ".json", ".md")):
            full_path = os.path.join(root, file)
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements:
                new_content = new_content.replace(old, new)
                
            if new_content != content:
                with open(full_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                modified_files.append(os.path.relpath(full_path, base_dir))

print(f"Updated {len(modified_files)} files cleanly:")
for mf in modified_files:
    print(f" - {mf}")
