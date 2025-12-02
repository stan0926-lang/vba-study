# VBA Master AI - EXEファイル作成ガイド 🚀

このガイドでは、VBA Master AIを配布用のEXEファイルにする方法を、初心者の方にもわかりやすく説明します。

---

## 📋 目次
1. [必要な環境の準備](#必要な環境の準備)
2. [ステップ1: プロジェクトの準備](#ステップ1-プロジェクトの準備)
3. [ステップ2: フロントエンドのビルド](#ステップ2-フロントエンドのビルド)
4. [ステップ3: EXEファイルの作成](#ステップ3-exeファイルの作成)
5. [ステップ4: 動作確認](#ステップ4-動作確認)
6. [トラブルシューティング](#トラブルシューティング)

---

## 必要な環境の準備

### 1. Python のインストール
- **バージョン**: Python 3.8 以降
- **ダウンロード**: https://www.python.org/downloads/
- インストール時に「Add Python to PATH」にチェックを入れてください

### 2. Node.js のインストール
- **バージョン**: Node.js 16 以降
- **ダウンロード**: https://nodejs.org/
- LTS版（安定版）を選択してください

### 3. 確認方法
PowerShellまたはコマンドプロンプトで以下を実行:
```powershell
python --version
node --version
npm --version
```

すべてバージョンが表示されればOKです！

---

## ステップ1: プロジェクトの準備

### 1-1. プロジェクトフォルダに移動
```powershell
cd C:\Users\kagam\Desktop\vba-master
```

### 1-2. Python仮想環境を作成・有効化
```powershell
# 仮想環境を作成（初回のみ）
python -m venv .venv

# 仮想環境を有効化
.\.venv\Scripts\Activate.ps1
```

**ヒント**: プロンプトの先頭に `(.venv)` と表示されれば成功です！

### 1-3. Pythonパッケージをインストール
```powershell
pip install -r requirements.txt
pip install pyinstaller
```

**説明**: 
- `requirements.txt` に記載されている必要なライブラリをインストール
- `pyinstaller` はPythonプログラムをEXEに変換するツール

### 1-4. Node.jsパッケージをインストール
```powershell
npm install
```

**説明**: フロントエンド（画面部分）に必要なライブラリをインストール

---

## ステップ2: フロントエンドのビルド

### 2-1. フロントエンドをビルド
```powershell
npm run build
```

**何が起こる？**
- TypeScript/Reactで書かれたコードが、ブラウザで動くHTMLとJavaScriptに変換されます
- 変換されたファイルは `dist/` フォルダに保存されます

**成功のサイン**:
```
✓ built in 2.50s
```
このようなメッセージが表示されればOK！

---

## ステップ3: EXEファイルの作成

### 3-1. PyInstallerでEXEを作成
```powershell
pyinstaller "VBA Master AI.spec"
```

**何が起こる？**
- Pythonのバックエンドコード、フロントエンドのビルド済みファイル、必要なライブラリがすべて1つのEXEにまとめられます
- 処理には1〜3分ほどかかります（コーヒーブレイク☕）

**成功のサイン**:
```
INFO: Building EXE from EXE-00.toc completed successfully.
```

### 3-2. 生成されたファイルを確認
```powershell
dir dist
```

以下のファイルが見つかればOK:
```
dist/
└── VBA Master AI.exe  ← これが完成したEXEファイルです！
```

---

## ステップ4: 動作確認

### 4-1. APIキー設定ファイルを準備
EXEファイルと同じフォルダに `.env.local` ファイルを配置します:

```
dist/
├── VBA Master AI.exe
└── .env.local  ← このファイルを作成
```

`.env.local` の内容:
```
GEMINI_API_KEY=あなたのAPIキーをここに入力
```

**⚠️ 重要**: APIキーは Google AI Studio (https://aistudio.google.com/apikey) で取得できます

### 4-2. EXEを起動
`dist` フォルダ内の `VBA Master AI.exe` をダブルクリック！

**期待される動作**:
1. コンソールウィンドウが開く
2. 「Running on http://127.0.0.1:5000」と表示される
3. 自動的にブラウザが開いてVBA Master AIの画面が表示される

---

## トラブルシューティング

### ❌ エラー: `pyinstaller: command not found`
**原因**: PyInstallerがインストールされていない  
**解決策**:
```powershell
pip install pyinstaller
```

### ❌ エラー: `ModuleNotFoundError: No module named 'flask'`
**原因**: 必要なライブラリがインストールされていない  
**解決策**:
```powershell
pip install -r requirements.txt
```

### ❌ エラー: `npm: command not found`
**原因**: Node.jsがインストールされていない、またはPATHが通っていない  
**解決策**:
1. Node.jsを再インストール
2. PowerShellを再起動

### ❌ ビルド時に `WARNING` がたくさん出る
**心配無用**: ほとんどの警告は無視して大丈夫です。最後に `completed successfully` と出れば成功です。

### ❌ EXEを起動しても画面が開かない
**確認事項**:
1. `.env.local` ファイルが `dist/` フォルダにあるか
2. APIキーが正しく設定されているか
3. インターネットに接続されているか
4. ファイアウォールでブロックされていないか

**デバッグ方法**:
PowerShellから直接起動してエラーメッセージを確認:
```powershell
cd dist
."VBA Master AI.exe"
```

### ❌ ポート5000が使用中のエラー
**原因**: 別のアプリケーションがポート5000を使用中  
**解決策**:
```powershell
# ポートを使用しているプロセスを確認
netstat -ano | findstr :5000

# プロセスを終了（PIDは上記コマンドで確認）
taskkill /PID [プロセスID] /F
```

---

## 📦 配布用ファイルの準備

### おすすめの配布構成
```
VBA_Master_AI_v1.0/
├── VBA Master AI.exe
├── .env.local.example    ← サンプルファイル（キーは空）
├── README.md             ← セットアップ手順を記載
└── INSTALL.txt           ← 簡単な使い方
```

### `.env.local.example` の内容
```
GEMINI_API_KEY=
```

### README.mdに記載すべき内容
```markdown
# セットアップ手順

1. `.env.local.example` を `.env.local` にリネーム
2. Google Gemini APIキーを取得: https://aistudio.google.com/apikey
3. `.env.local` を開き、`GEMINI_API_KEY=` の後にキーを貼り付け
4. `VBA Master AI.exe` を起動

※ 初回起動時はファイアウォールの許可が必要な場合があります
```

---

## 🎓 よくある質問

### Q1: EXEファイルのサイズが大きいのはなぜ？
**A**: Python本体とすべての依存ライブラリが含まれているためです。通常100MB〜200MBになります。

### Q2: 他のPCでも動きますか？
**A**: はい！Pythonがインストールされていない環境でも動作します。ただし、Windows専用です。

### Q3: ビルドのたびに dist フォルダを削除すべき？
**A**: 推奨します。古いファイルが残っていると問題が起きる場合があります:
```powershell
Remove-Item -Recurse -Force dist, build
```

### Q4: APIキーをEXEに埋め込むことはできますか？
**A**: 技術的には可能ですが、セキュリティ上推奨しません。EXEから文字列を抽出されるリスクがあります。

### Q5: Macでも動きますか？
**A**: このガイドはWindows用です。Macの場合は別途設定が必要です。

---

## 📚 参考資料

- PyInstaller公式ドキュメント: https://pyinstaller.org/
- Vite公式ドキュメント: https://vitejs.dev/
- Flask公式ドキュメント: https://flask.palletsprojects.com/

---

## 🎉 完成おめでとうございます！

これで配布用のEXEファイルが完成しました。  
ユーザーに配布する際は、セットアップ手順を忘れずに添付してください。

質問や問題があれば、開発チームにお問い合わせください。

**Happy Coding! 🚀**

---

**最終更新**: 2025年12月2日  
**バージョン**: 1.0.0
