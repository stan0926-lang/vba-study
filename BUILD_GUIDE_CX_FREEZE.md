# VBA Master AI - cx_Freeze版 EXE作成ガイド 🚀

このガイドは、**cx_Freezeを使ってEXEファイルを作成したい方**向けです。

> ℹ️ **前提条件**: 
> - フロントエンド（画面部分）は既にビルド済みで、`dist/`フォルダに保存されています
> - Node.jsは不要です

---

## 📋 このガイドで必要なもの

✅ Python 3.8以降のみ  
❌ Node.jsは不要！  
❌ npmも不要！

---

## 🎯 作業の流れ

1. Pythonのインストール
2. プロジェクトフォルダの準備
3. Python仮想環境のセットアップ
4. cx_Freezeのインストール
5. setup.pyの作成
6. EXEファイルの作成
7. 動作確認

---

## ステップ1: Pythonのインストール

### 1-1. Pythonのダウンロード
- **公式サイト**: https://www.python.org/downloads/
- **推奨バージョン**: Python 3.10以降

### 1-2. インストール時の注意
✅ **必ず「Add Python to PATH」にチェックを入れてください**

### 1-3. インストール確認
PowerShellを開いて以下を実行:
```powershell
python --version
```

**期待される出力**:
```
Python 3.10.x
```

バージョンが表示されればOKです！

---

## ステップ2: プロジェクトフォルダの準備

### 2-1. フォルダ構造の確認
プロジェクトフォルダに以下のファイルがあることを確認してください:

```
vba-master/
├── app.py                    ← Pythonのメインプログラム
├── requirements.txt          ← 必要なライブラリのリスト
├── .env.local               ← API設定ファイル
└── dist/                     ← ビルド済みのフロントエンド（重要！）
    ├── index.html
    └── assets/
        ├── index-xxxxx.js
        └── index-xxxxx.css
```

### 2-2. dist フォルダの確認
```powershell
cd C:\Users\kagam\Desktop\vba-master
dir dist
```

**確認項目**:
- ✅ `index.html` が存在する
- ✅ `assets/` フォルダが存在する
- ✅ `assets/` 内に `.js` と `.css` ファイルがある

**ファイルが見つからない場合**:
- 開発者にビルド済みの`dist`フォルダを提供してもらってください
- または、Node.jsをインストールして`npm run build`を実行してください

---

## ステップ3: Python仮想環境のセットアップ

### 3-1. プロジェクトフォルダに移動
```powershell
cd C:\Users\kagam\Desktop\vba-master
```

### 3-2. 仮想環境を作成
```powershell
python -m venv .venv
```

**何が起こる？**
- `.venv`という名前のフォルダが作成されます
- このフォルダにPython環境が独立して構築されます
- 処理には30秒〜1分かかります

### 3-3. 仮想環境を有効化
```powershell
.\.venv\Scripts\Activate.ps1
```

**成功のサイン**:
プロンプトの先頭に `(.venv)` が表示されます:
```
(.venv) PS C:\Users\kagam\Desktop\vba-master>
```

**⚠️ エラーが出た場合**:
PowerShellの実行ポリシーが制限されている可能性があります。以下を実行:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
その後、再度有効化コマンドを実行してください。

### 3-4. 必要なライブラリをインストール
```powershell
pip install -r requirements.txt
```

**何が起こる？**
- Flask、google-generativeai、python-dotenvなど、必要なライブラリがすべてインストールされます
- 処理には1〜3分かかります

**成功のサイン**:
```
Successfully installed flask-xxx google-generativeai-xxx ...
```

---

## ステップ4: cx_Freezeのインストール

### 4-1. cx_Freezeをインストール
```powershell
pip install cx_Freeze
```

**cx_Freezeとは？**
- Pythonプログラムを実行可能なEXEファイルに変換するツール
- PyInstallerよりもシンプルで、ビルドが高速
- インストールには30秒〜1分かかります

**成功のサイン**:
```
Successfully installed cx_Freeze-x.x.x
```

---

## ステップ5: setup.pyの作成

### 5-1. setup.pyファイルの作成

プロジェクトフォルダに`setup.py`というファイルを作成します（既に存在する場合はスキップ）。

**setup.pyの内容**:
```python
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
```

**ファイルの配置**:
```
vba-master/
├── app.py
├── setup.py          ← 新規作成
├── requirements.txt
├── .env.local
└── dist/
```

---

## ステップ6: EXEファイルの作成

### 6-1. 古いビルドファイルを削除（推奨）
```powershell
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
```

**説明**: 古いファイルが残っていると問題が起きる場合があるため、念のため削除します。

### 6-2. cx_FreezeでEXEを作成
```powershell
python setup.py build
```

**何が起こる？**
1. Pythonのコード（app.py）を解析
2. 必要なライブラリをすべて収集
3. フロントエンド（dist/フォルダ）を組み込む
4. `build/`フォルダに実行ファイルを生成

**処理時間**: 1〜2分（コーヒーブレイク☕）

### 6-3. ビルドプロセスの進行状況
以下のようなメッセージが表示されます:

```
running build
running build_exe
copying C:\Users\...\python310.dll -> build\exe.win-amd64-3.10\python310.dll
copying C:\Users\...\.venv\Lib\site-packages\flask\...
...
```

### 6-4. 完成確認
```powershell
dir build\exe.win-amd64-3.10
```

**期待される出力**:
```
build/exe.win-amd64-3.10/
├── VBA Master AI.exe      ← 完成したEXEファイル！
├── python310.dll          ← Python実行環境
├── lib/                   ← 必要なライブラリ
├── dist/                  ← フロントエンドファイル
│   ├── index.html
│   └── assets/
└── .env.local            ← API設定ファイル
```

---

## ステップ7: 動作確認

### 7-1. APIキー設定の確認

**重要**: EXEを実行する前に、`.env.local`にAPIキーが正しく設定されているか確認してください。

`.env.local`の内容:
```
GEMINI_API_KEY=your_actual_api_key_here
```

**APIキーの取得方法**:
1. https://makersuite.google.com/app/apikey にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. 生成されたキーをコピーして`.env.local`に貼り付け

### 7-2. EXEを実行
```powershell
cd build\exe.win-amd64-3.10
.\VBA` Master AI.exe
```

**成功のサイン**:
```
 * Serving Flask app 'app'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

ブラウザが自動的に開き、VBA Master AIの画面が表示されます！

### 7-3. 機能テスト

以下の機能が正常に動作することを確認してください:

1. **AI講師モード**
   - 「セルの値を取得する方法を教えて」などと入力
   - AIからの応答が表示される

2. **ロードマップ表示**
   - 学習計画が表示される

3. **クイズモード**
   - クイズ問題が生成される

**⚠️ エラーが出た場合**:
- APIキーが正しく設定されているか確認
- インターネット接続を確認
- ポート5000が他のアプリで使用されていないか確認

---

## 📦 配布方法

### 配布するフォルダ
```
build/exe.win-amd64-3.10/  ← このフォルダ全体を配布
```

### 配布手順
1. `build/exe.win-amd64-3.10/`フォルダ全体をZIPで圧縮
2. 受け取った人は解凍して`VBA Master AI.exe`を実行するだけ

**注意事項**:
- ✅ フォルダ内のすべてのファイルが必要です
- ✅ `dist/`、`lib/`、DLLファイルも一緒に配布してください
- ❌ EXEファイル単体では動作しません

---

## 🔧 トラブルシューティング

### Q1: 「python: コマンドが見つかりません」と表示される
**A**: Pythonがインストールされていないか、PATHが通っていません。
- Pythonを再インストールし、「Add Python to PATH」にチェックを入れてください

### Q2: 仮想環境の有効化でエラーが出る
**A**: 実行ポリシーの制限です。
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Q3: ビルドは成功したが、EXEが起動しない
**A**: 以下を確認してください:
- `.env.local`が`build/exe.win-amd64-3.10/`内に存在するか
- `dist/`フォルダが`build/exe.win-amd64-3.10/`内に存在するか
- Windows Defenderやセキュリティソフトでブロックされていないか

### Q4: APIキーエラーが出る
**A**: `.env.local`の設定を確認:
```
GEMINI_API_KEY=your_actual_api_key_here
```
- `your_actual_api_key_here`を実際のAPIキーに置き換えてください
- スペースや改行が入っていないか確認

### Q5: ポート5000が使用中エラー
**A**: 別のアプリケーションがポート5000を使用しています:
```powershell
# 使用中のプロセスを確認
netstat -ano | findstr :5000
```

---

## 💡 PyInstallerとの違い

| 項目 | cx_Freeze | PyInstaller |
|------|-----------|-------------|
| **ビルド速度** | ⚡ 高速 | やや遅い |
| **ファイルサイズ** | 📦 やや大きい | 小さい |
| **配布方法** | フォルダごと | EXE単体可能 |
| **トラブル対応** | シンプル | 複雑な場合あり |
| **推奨用途** | 開発・テスト配布 | 最終製品配布 |

---

## ✅ チェックリスト

EXE作成前に以下を確認してください:

- [ ] Python 3.10以降がインストール済み
- [ ] `dist/`フォルダにフロントエンドファイルが存在
- [ ] `.env.local`にAPIキーを設定済み
- [ ] 仮想環境を有効化している
- [ ] `requirements.txt`のライブラリをインストール済み
- [ ] cx_Freezeをインストール済み
- [ ] `setup.py`を作成済み

すべてチェックが付いたら、`python setup.py build`を実行しましょう！

---

## 🎉 完成！

お疲れ様でした！これでNode.js不要でVBA Master AIのEXEファイルが完成しました。

**次のステップ**:
- 他のPCでも動作するかテストしてみましょう
- 友人や同僚に配布して、フィードバックをもらいましょう

Happy Coding! 🚀
