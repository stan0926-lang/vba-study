import os
import json
import sys
import webbrowser
from threading import Timer
from flask import Flask, request, jsonify, send_from_directory
import google.generativeai as genai
from dotenv import load_dotenv


# 実行環境に応じたベースディレクトリを決定する
# - PyInstaller の onefile 実行では一時展開先が sys._MEIPASS に入る
# - 通常の開発実行ではカレントディレクトリを使う
BASE_DIR = getattr(sys, '_MEIPASS', os.path.abspath('.'))

# .env ファイルをベースディレクトリから読み込む（.env.local を優先）
env_local_path = os.path.join(BASE_DIR, '.env.local')
if os.path.exists(env_local_path):
    load_dotenv(env_local_path)
else:
    # フォールバック: カレントディレクトリの .env.local
    load_dotenv('.env.local')

# 配信する静的ファイルのディレクトリ（絶対パス）
DIST_DIR = os.path.join(BASE_DIR, 'dist')
app = Flask(__name__, static_folder=DIST_DIR)

# APIキーの設定
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("Warning: API_KEY is not set in .env file.")

genai.configure(api_key=API_KEY)

# 使用するモデル
MODEL_NAME = 'gemini-2.5-flash'

# システムプロンプト（AI講師の人格設定）
SYSTEM_INSTRUCTION = """
あなたは世界で最も優れたVBA（Excel Visual Basic for Applications）の専任講師です。
あなたの使命は、初心者から中級者の学習者を導き、彼らが実務で通用する堅牢で美しいコードを書けるようにすることです。

## 指導方針
1. 肯定と共感: ユーザーは初心者です。専門用語で突き放さず、まずは挑戦を称えてください。
2. 具体例重視: 抽象的な概念（オブジェクト指向など）は、必ず「タイヤキの型」や「住所録」などの比喩を用いて説明してください。
3. ベストプラクティス: 古い書き方（Select/Selectionの多用など）は優しく指摘し、最新の書き方（直接参照、配列処理）を推奨してください。
4. コードブロック: コードを提示する際は、必ずMarkdownのコードブロック（```vba ... ```）を使用してください。
5. 日本語で回答してください。
"""

@app.route('/')
def index():
    """トップページ (dist/index.html) を返す"""
    # dist が存在する場合は dist/index.html を返す
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')
    # それ以外はベースディレクトリの index.html を返す（開発用）
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    """
    静的ファイル (.tsx, .css, .js 等) を返す。
    Reactのimport文など拡張子がないリクエストにも対応。
    """
    # まず dist にファイルがあれば返す
    dist_path = os.path.join(DIST_DIR, path)
    if os.path.exists(dist_path):
        return send_from_directory(DIST_DIR, path)

    # 拡張子が省略されている場合のフォールバック (dist を先に確認)
    for ext in ['.tsx', '.ts', '.js', '.css', '.json']:
        if os.path.exists(os.path.join(DIST_DIR, path + ext)):
            return send_from_directory(DIST_DIR, path + ext)

    # dist にない場合はベースディレクトリの静的ファイル (開発ルート) を確認
    if os.path.exists(os.path.join(BASE_DIR, path)):
        return send_from_directory(BASE_DIR, path)
    for ext in ['.tsx', '.ts', '.js', '.css', '.json']:
        candidate = os.path.join(BASE_DIR, path + ext)
        if os.path.exists(candidate):
            return send_from_directory(BASE_DIR, path + ext)

    # SPA を想定している場合は index.html にフォールバック
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')

    return "File not found", 404

@app.route('/api/chat', methods=['POST'])
def chat():
    """AI講師とのチャットAPI"""
    data = request.json
    history = data.get('history', [])
    message = data.get('message', '')

    try:
        # 履歴をGemini APIの形式に変換
        gemini_history = []
        for msg in history:
            role = 'user' if msg['role'] == 'user' else 'model'
            gemini_history.append({'role': role, 'parts': [msg['text']]})

        # チャットセッションの開始
        model = genai.GenerativeModel(MODEL_NAME, system_instruction=SYSTEM_INSTRUCTION)
        chat_session = model.start_chat(history=gemini_history)
        
        response = chat_session.send_message(message)
        return jsonify({'text': response.text})
    except Exception as e:
        print(f"Chat API Error: {e}")
        return jsonify({'text': "申し訳ありません。サーバーエラーが発生しました。"}), 500

@app.route('/api/quiz', methods=['POST'])
def quiz():
    """クイズ生成API"""
    data = request.json
    topic = data.get('topic', 'VBA Basics')
    
    prompt = f"""
    トピック「{topic}」に基づいて、Excel VBAの4択クイズを作成してください。
    
    以下の【3つのパターンのうち1つ】をランダムに選んで問題を作成してください。
    パターン1: 【出力予測】コードの実行結果を問う。
    パターン2: 【エラー分析】エラーの原因を問う。
    パターン3: 【穴埋め問題】コードの空欄に入るものを問う。

    必ず以下のJSON形式のみを出力してください（Markdownのコードブロックで囲まないでください）:
    {{
        "question": "Markdown形式の問題文（コードブロック含む）",
        "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
        "correctAnswerIndex": 0,
        "explanation": "Markdown形式の解説",
        "suggestedQuestions": ["この問題に関連する質問例1", "質問例2", "質問例3"]
    }}
    """

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return jsonify(json.loads(response.text))
    except Exception as e:
        print(f"Quiz API Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/review', methods=['POST'])
def review():
    """コードレビューAPI - 詳細で精確な分析"""
    data = request.json
    code = data.get('code', '')

    # 詳細で精確なコードレビュープロンプト
    prompt = f"""
あなたは20年の経験を持つVBA専門家です。以下のコードを以下の厳格な基準で評価してください。

【分析対象コード】
```vba
{code}
```

【評価観点と基準】

1. 保守性 (Maintainability):
   - 変数宣言の明確性（Option Explicit有無）
   - モジュール化とカプセル化
   - 名前の明確さ（変数名、関数名が自明か）

2. 可読性 (Readability):
   - インデント、コメント、空行の適切さ
   - 関数の長さ（30行以内が目安）
   - ネストの深さ

3. 効率性 (Efficiency):
   - 無駄なループ、検索、計算がないか
   - Select/Activateの多用がないか
   - 配列操作の効率性

4. 安全性 (Robustness):
   - エラーハンドリング（On Error GoTo/Resume等）
   - 入力値チェック
   - 範囲外アクセスの防止

5. 一貫性 (Consistency):
   - ネーミング規約の統一
   - インデントスタイルの統一
   - API使用パターンの統一

【JSON形式での出力（必須）】
{{
    "metrics": {{
        "maintainability": 3,
        "readability": 3,
        "efficiency": 3,
        "robustness": 3,
        "consistency": 3
    }},
    "strengths": ["いい点1", "いい点2"],
    "improvements": ["改善点1", "改善点2"],
    "suggested_code": "改善されたコードをMarkdown形式で提示。具体的な修正を含める。"
}}

【出力要件】
- metricsは1-5の整数のみ
- strengthsは最大3つ、簡潔に（20字以内）
- improvementsは最大3つ、簡潔に（20字以内）
- suggested_codeはMarkdownのコードブロック形式で、修正が必要な部分を明示
- 必ず上記JSON形式のみを出力（説明文は不要）"""

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        # JSON パース（エラーハンドリング付き）
        try:
            result = json.loads(response.text)
            # デフォルト値で欠落フィールドを補完
            if 'strengths' not in result:
                result['strengths'] = []
            if 'improvements' not in result:
                result['improvements'] = []
            if 'suggested_code' not in result:
                result['suggested_code'] = ''
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}, Response: {response.text[:500]}")
            result = {
                "metrics": {"maintainability": 0, "readability": 0, "efficiency": 0, "robustness": 0, "consistency": 0},
                "strengths": [],
                "improvements": ["分析中にエラーが発生しました。"],
                "suggested_code": ""
            }
        
        return jsonify(result)
    except Exception as e:
        print(f"Review API Error: {e}")
        return jsonify({
            'metrics': {'maintainability': 0, 'readability': 0, 'efficiency': 0, 'robustness': 0, 'consistency': 0},
            'strengths': [],
            'improvements': [f'エラー: {str(e)[:50]}'],
            'suggested_code': ''
        }), 500

if __name__ == '__main__':
    # 本番環境ではGunicornを使用
    # 開発環境: python app.py で実行
    # 本番環境: gunicorn --workers 4 --bind 127.0.0.1:5000 app:app で実行
    is_production = os.getenv('PRODUCTION', 'false').lower() == 'true'
    
    # ブラウザを自動で開く（開発環境とEXE実行時、親プロセスのみ）
    def open_browser():
        webbrowser.open('http://localhost:5000')
    
    if not is_production:
        # メインプロセスのみでブラウザを開く（Werkzeugのreloader対応）
        import sys
        if not os.environ.get('WERKZEUG_RUN_MAIN'):
            # 2秒後にブラウザを開く（Flask サーバー起動を待つ）
            timer = Timer(2, open_browser)
            timer.daemon = True
            timer.start()
    
    # reloader を無効にして、ブラウザが複数回起動するのを防ぐ
    app.run(debug=not is_production, port=5000, use_reloader=False)