# VBA Master AI - Node.js不要版 EXE作成ガイド 🚀

このガイドは、**Node.jsがインストールされていない環境でEXEファイルを作成したい方**向けです。

> ℹ️ **前提条件**: フロントエンド（画面部分）は既にビルド済みで、`dist/`フォルダに保存されています。

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
4. EXEファイルの作成
5. 動作確認

---

## ステップ1: Pythonのインストール

### 1-1. Pythonのダウンロード
- **公式サイト**: https://www.python.org/downloads/
- **推奨バージョン**: Python 3.12以降

### 1-2. インストール時の注意
✅ **必ず「Add Python to PATH」にチェックを入れてください**

![Pythonインストール画面で最下部のチェックボックスを必ず選択]

### 1-3. インストール確認
PowerShellを開いて以下を実行:
```powershell
python --version
```

**期待される出力**:
```
Python 3.12.x
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
├── VBA Master AI.spec        ← PyInstallerの設定ファイル
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

### 3-5. PyInstallerをインストール
```powershell
pip install pyinstaller
```

**PyInstallerとは？**
- Pythonプログラムを実行可能なEXEファイルに変換するツール
- インストールには30秒〜1分かかります

---

## ステップ4: EXEファイルの作成

### 4-1. 古いビルドファイルを削除（推奨）
```powershell
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
Remove-Item -Force "dist\VBA Master AI.exe" -ErrorAction SilentlyContinue
```

**説明**: 古いファイルが残っていると問題が起きる場合があるため、念のため削除します。

### 4-2. PyInstallerでEXEを作成
```powershell
pyinstaller "VBA Master AI.spec"
```

**何が起こる？**
1. Pythonのコード（app.py）を解析
2. 必要なライブラリをすべて収集
3. フロントエンド（dist/フォルダ）を組み込む
4. 1つのEXEファイルにまとめる

**処理時間**: 1〜3分（コーヒーブレイク☕）

### 4-3. ビルドプロセスの進行状況
以下のようなメッセージが表示されます:

```
INFO: PyInstaller: 6.17.0
INFO: Python: 3.12.x
INFO: Platform: Windows-11-10.0.xxxxx-SP0
...
INFO: Looking for dynamic libraries
...
INFO: Building EXE from EXE-00.toc completed successfully.
```

### 4-4. 完成確認
```powershell
dir dist
```

**期待される出力**:
```
dist/
├── assets/                    ← フロントエンドファイル
├── index.html                 ← フロントエンドファイル
└── VBA Master AI.exe          ← 完成したEXEファイル！
```

**⚠️ 注意**: 
- `dist`フォルダには以前からあった`assets/`と`index.html`が残っています
- 配布時は**EXEファイルだけでOK**です（assetsとindex.htmlはEXEに組み込まれています）

---

## ステップ5: 動作確認

### 5-1. APIキー設定ファイルを準備

#### .env.local ファイルを作成
`dist`フォルダに`.env.local`というファイルを作成します:

```powershell
cd dist
notepad .env.local
```

メモ帳が開くので、以下を入力して保存:
```
GEMINI_API_KEY=あなたのAPIキーをここに入力
```

**APIキーの取得方法**:
1. https://aistudio.google.com/apikey にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. 生成されたキーをコピー

### 5-2. EXEファイルを起動
`dist`フォルダ内の`VBA Master AI.exe`をダブルクリック！

### 5-3. 期待される動作
1. **コンソールウィンドウが開く**
```
* Serving Flask app 'app'
* Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

2. **ブラウザが自動で開く**
   - アドレスバーに `http://localhost:5000` が表示される
   - VBA Master AIの画面が表示される

3. **AIチューターに質問してみる**
   - 「VBAとは何ですか？」などと質問
   - AIが回答すれば成功です！

---

## 🎁 配布用パッケージの作成

### 推奨構成
```
VBA_Master_AI_v1.0/
├── VBA Master AI.exe
├── .env.local.example         ← サンプルファイル
├── README.md                  ← セットアップ手順
└── INSTALL.txt                ← 簡易マニュアル
```

### .env.local.example の内容
```
GEMINI_API_KEY=
```

### README.mdに記載すべき内容
```markdown
# VBA Master AI セットアップ手順

## 必要なもの
- Windows 10以降
- インターネット接続
- Google Gemini APIキー（無料）

## インストール手順

1. このフォルダ全体を好きな場所にコピー
2. `.env.local.example` を `.env.local` にリネーム
3. `.env.local` を開き、APIキーを入力
4. `VBA Master AI.exe` をダブルクリックして起動

## APIキーの取得方法
https://aistudio.google.com/apikey

## トラブルシューティング
- ファイアウォールの警告が出たら「アクセスを許可する」を選択
- ブラウザが開かない場合は手動で http://localhost:5000 にアクセス
```

---

## ❗ トラブルシューティング

### エラー1: `python: command not found`
**原因**: Pythonがインストールされていない、またはPATHが通っていない

**解決策**:
1. Pythonを再インストール（「Add Python to PATH」にチェック）
2. PowerShellを再起動

### エラー2: `.venv\Scripts\Activate.ps1 cannot be loaded`
**原因**: PowerShellの実行ポリシーが制限されている

**解決策**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### エラー3: `ModuleNotFoundError: No module named 'flask'`
**原因**: 必要なライブラリがインストールされていない

**解決策**:
```powershell
# 仮想環境が有効になっているか確認（(.venv)が表示されているか）
.\.venv\Scripts\Activate.ps1

# ライブラリを再インストール
pip install -r requirements.txt
```

### エラー4: `FileNotFoundError: [Errno 2] No such file or directory: 'dist'`
**原因**: distフォルダが存在しない、またはビルドされていない

**解決策**:
1. 開発者にビルド済みのdistフォルダを提供してもらう
2. または、Node.jsをインストールして`npm run build`を実行

### エラー5: EXE起動後にブラウザが開かない
**原因**: ブラウザの自動起動に失敗した

**解決策**:
手動でブラウザを開いて `http://localhost:5000` にアクセス

### エラー6: `Port 5000 is already in use`
**原因**: 別のアプリケーションがポート5000を使用中

**解決策**:
```powershell
# ポートを使用しているプロセスを確認
netstat -ano | findstr :5000

# プロセスIDを確認して終了
taskkill /PID [プロセスID] /F
```

---

## 📊 ファイルサイズについて

**EXEファイルのサイズ**: 約100〜200MB

**なぜこんなに大きい？**
- Python本体（約30MB）
- すべてのライブラリ（Flask、google-generativeaiなど）
- フロントエンド（HTML/JS/CSS）

これらがすべて1つのEXEに含まれているためです。

---

## 🎓 よくある質問

### Q1: Node.jsは本当に不要ですか？
**A**: はい！`dist`フォルダにビルド済みファイルがあれば不要です。ただし、フロントエンドのコードを変更する場合はNode.jsが必要になります。

### Q2: 他のPCでも動きますか？
**A**: はい！Pythonがインストールされていない環境でも動作します。

### Q3: ウイルス対策ソフトが警告を出します
**A**: PyInstallerで作成したEXEは誤検知されることがあります。安全なファイルです。ホワイトリストに追加してください。

### Q4: インターネット接続は必須ですか？
**A**: はい。Google Gemini APIを使用するため、インターネット接続が必要です。

### Q5: APIキーの料金は？
**A**: Google Gemini APIは無料枠があります。通常の使用であれば無料で使えます。

---

## 📚 次のステップ

EXEファイルが完成したら:

1. ✅ 動作確認を行う
2. ✅ 配布用パッケージを作成する
3. ✅ ユーザー向けマニュアルを準備する
4. ✅ 社内で共有する

---

## 🎉 完成おめでとうございます！

このガイドに従って、Node.jsなしでEXEファイルを作成できました。

**重要なポイント**:
- ✅ Pythonさえあればビルド可能
- ✅ distフォルダが重要（これがフロントエンド）
- ✅ 配布時は.env.localの準備を忘れずに

---

**最終更新**: 2025年12月2日  
**バージョン**: 1.0.0  
**対象者**: Node.js未インストール環境での開発者
