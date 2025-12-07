import sys
from cx_Freeze import setup, Executable

# 依存関係
build_exe_options = {
    "packages": [
        "flask",
        "google.generativeai",
        "dotenv",
        "os",
        "json",
        "sys",
        "webbrowser",
        "threading"
    ],
    "include_files": [
        ("dist", "dist"),           # フロントエンドファイル
        (".env.local", ".env.local")  # API設定ファイル
    ],
    "excludes": ["tkinter"],
}

# 実行ファイル設定
base = None
if sys.platform == "win32":
    base = "Console"  # コンソールウィンドウを表示

setup(
    name="VBA Master AI",
    version="1.0",
    description="VBA学習支援AIツール",
    options={"build_exe": build_exe_options},
    executables=[Executable("app.py", base=base, target_name="VBA Master AI.exe")]
)
