# VBA Master AI 配布ガイド

## 概要
VBA Master AI は、Google Gemini AI を活用した VBA 学習ツールです。Windows 用スタンドアロン実行ファイルとして配布できます。

## 必要な環境
- **OS**: Windows 10 以降
- **メモリ**: 最小 2GB RAM（推奨 4GB 以上）
- **ネットワーク**: インターネット接続が必須（Google Gemini API 利用）

## インストール手順

### 1. ファイルの配置
以下のファイルをユーザーのマシンにコピーします：

```
VBA Master AI.exe       # メインアプリケーション
.env.local             # API キー設定ファイル（重要）
README.md              # 使用方法
```

### 2. API キー設定
アプリケーションを実行する前に、`.env.local` ファイルで API キーを設定してください：

```
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

**注意**: `.env.local` ファイルには認証情報が含まれているため、リポジトリに追加しないでください。

## 実行方法

### GUI による起動
`VBA Master AI.exe` をダブルクリックして実行します。

以下のようなコンソール画面が表示されます：
```
* Serving Flask app 'app'
* Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

### ブラウザでのアクセス
1. EXE を実行後、自動的にブラウザが起動します（または手動で以下にアクセス）
2. `http://localhost:5000` をブラウザのアドレスバーに入力
3. VBA Master AI のインターフェースが表示されます

## 機能

### 1. AI チューター
- VBA コードの質問に対して Gemini AI が即座に回答
- 初心者向けの親切な説明を提供
- 具体例と比喩を使った説明

### 2. クイズモード
- VBA の基礎知識を確認できます
- 理解度に応じた自動採点

### 3. コードレビュー
- 自分が書いたコードを AI に評価してもらえます
- 改善案と解説が得られます

### 4. リソースライブラリ
- VBA ロードマップ
- ベストプラクティス集
- 標準ガイドライン

## トラブルシューティング

### ブラウザが開かない場合
手動で `http://localhost:5000` にアクセスしてください。

### ポート 5000 が使用中の場合
別のアプリケーションがポート 5000 を使用しています。以下を実行してください：
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### API キー エラー
- `.env.local` ファイルが存在することを確認
- `GEMINI_API_KEY` が正しく設定されていることを確認
- API キーの有効期限を確認

### ネットワークエラー
- インターネット接続が正常に機能していることを確認
- ファイアウォール設定を確認
- Google Cloud API へのアクセスが制限されていないことを確認

## 開発者向け情報

### ソースコードの構成
```
vba-master/
├── app.py              # Flask バックエンド
├── index.tsx           # React フロントエンド（TypeScript）
├── components/         # React コンポーネント
├── services/           # API サービス
├── dist/               # ビルド済みフロントエンド
├── .env.local          # 環境変数設定
├── requirements.txt    # Python 依存パッケージ
├── package.json        # Node.js 依存パッケージ
└── VBA Master AI.spec  # PyInstaller 設定
```

### ローカル開発での実行

**バックエンド**:
```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

**フロントエンド**:
```bash
npm install
npm run dev
```

**EXE ビルド**:
```bash
npm run build
pyinstaller "VBA Master AI.spec"
```

## ライセンス
社内用途限定

## サポート
不具合や機能リクエストについては、開発チームにお問い合わせください。

---

**最終更新**: 2025年11月28日
**バージョン**: 1.0.0
