import { Lesson, RoadmapWeek, CodingStandard } from './types';

export const LEARNING_ROADMAP: RoadmapWeek[] = [
  {
    week: 1,
    title: '導入編',
    items: [
      '開発タブの表示、VBEの起動方法',
      'マクロ記録で「コードが自動生成される」体験',
      'VBAでできることの概要（自動化・データ処理・UI操作）'
    ]
  },
  {
    week: 2,
    title: '基本文法編①',
    items: [
      '変数とデータ型（Dim、Integer、String）',
      '演算子と代入',
      '簡単な計算マクロを作成'
    ]
  },
  {
    week: 3,
    title: '基本文法編②',
    items: [
      '条件分岐（If...Then...Else、Select Case）',
      '繰り返し処理（For...Next、Do While）',
      '練習問題：九九表を自動生成するマクロ'
    ]
  },
  {
    week: 4,
    title: 'Excel操作編①',
    items: [
      'セルや範囲の指定（Range、Cells）',
      '値の取得と代入',
      '書式設定（色、フォント、罫線）'
    ]
  },
  {
    week: 5,
    title: 'Excel操作編②',
    items: [
      'ワークシートやブックの操作（追加、削除、コピー）',
      '練習問題：複数シートのデータをまとめるマクロ'
    ]
  },
  {
    week: 6,
    title: '応用構造編①',
    items: [
      '配列とコレクション',
      '関数の作成（Function）',
      '練習問題：配列を使った平均値計算'
    ]
  },
  {
    week: 7,
    title: '応用構造編②',
    items: [
      'エラー処理（On Error Resume Next、Errオブジェクト）',
      'ユーザーフォームの基礎（入力フォーム、ボタン）'
    ]
  },
  {
    week: 8,
    title: '実務活用編①',
    items: [
      'データ集計（ループで表を処理）',
      '自動レポート作成（グラフや表を生成）'
    ]
  },
  {
    week: 9,
    title: '実務活用編②',
    items: [
      'OutlookやWordとの連携（メール送信、文書操作）',
      'ファイル操作（保存、読み込み、フォルダ内処理）'
    ]
  },
  {
    week: 10,
    title: '発展編',
    items: [
      'クラスモジュールとオブジェクト指向的な考え方',
      '高速化テクニック（ScreenUpdating制御、計算モード変更）',
      '実務プロジェクト例（請求書自動生成、在庫管理ツール）'
    ]
  }
];

export const VBA_CODING_STANDARDS: CodingStandard[] = [
  {
    id: 1,
    title: '命名規則 (Naming Conventions)',
    description: '変数や関数には「プレフィックス（接頭辞）」と「意味のある名前」を付けます。型が一目で分かるようにすることで、バグを未然に防ぎます。',
    content: `
## 変数の命名
**ルール**: プレフィックス(小文字) + 意味のある単語(PascalCase)

| データ型 | プレフィックス | 例 |
|---|---|---|
| String | str | \`strCustomerName\` |
| Integer/Long | int | \`intRowCount\` |
| Double | dbl | \`dblTaxRate\` |
| Range | rng | \`rngSalesData\` |
| Worksheet | ws | \`wsMaster\` |
| Workbook | wb | \`wbTarget\` |
| Dictionary | dic | \`dicItems\` |
| Collection | col | \`colEmployees\` |

※ ループカウンタのみ、慣習的に \`i\`, \`j\`, \`k\` の使用を許可します。

## 定数の命名
**ルール**: 全て大文字 + アンダースコア区切り
\`\`\`vba
Const CONST_MAX_ROWS As Long = 1000
Const CONST_FILE_PATH As String = "C:\\Data\\"
\`\`\`

## 関数・プロシージャの命名
**ルール**: 動詞 + 目的語 (+ 条件)
\`\`\`vba
Sub ExportReportToPDF()      ' ⭕️ 何をするか明確
Function CalculateAverage()  ' ⭕️ 何を計算するか明確
Sub Button1_Click()          ' ❌ 自動生成のままは避ける（btnExport_Click 等に変える）
\`\`\`
`
  },
  {
    id: 2,
    title: 'インデントと構造 (Indentation & Structure)',
    description: 'コードの見た目は品質そのものです。可読性を高めるための厳格なルールです。',
    content: `
## インデント（字下げ）
*   **ルール**: インデントは「半角スペース4つ」で固定。
*   **ルール**: ブロック（If, For, With, Sub等）の中は必ずインデントする。

\`\`\`vba
' ❌ NG例: インデントがなく、構造が見えない
Sub BadIndent()
If Cells(1,1).Value = "" Then
MsgBox "Empty"
Else
For i = 1 To 10
Cells(i,1).Value = i
Next i
End If
End Sub

' ✅ OK例: 構造が一目瞭然
Sub GoodIndent()
    If Cells(1, 1).Value = "" Then
        MsgBox "Empty"
    Else
        For i = 1 To 10
            Cells(i, 1).Value = i
        Next i
    End If
End Sub
\`\`\`

## 空行のルール
*   関数（Sub/Function）の間は **2行** 空ける。
*   処理の論理ブロック（まとまり）の間は **1行** 空ける。
`
  },
  {
    id: 3,
    title: 'コメント規約 (Comments)',
    description: '「何をしているか」ではなく「なぜそうしているか（意図）」を書くのが良いコメントです。',
    content: `
## 冒頭コメント（必須）
各プロシージャの先頭に、目的と入出力を記述します。

\`\`\`vba
'-----------------------------------------------
' Function: CalculateTotalSales
' Purpose : 指定期間の売上合計を計算する
' Input   : rngData (Range) - 売上データ範囲
' Output  : Double - 合計値（計算不可時は-1）
'-----------------------------------------------
Function CalculateTotalSales(rngData As Range) As Double
\`\`\`

## 処理中のコメント
*   **禁止**: コードを日本語訳しただけのコメント
    \`i = i + 1 ' iに1を足す\` (❌ 不要)
*   **推奨**: 処理の理由や意図
    \`i = i + 1 ' 見出し行をスキップするため1行ずらす\` (✅ 重要)
`
  },
  {
    id: 4,
    title: 'エラー処理 (Error Handling)',
    description: 'プロのコードは、エラーが発生した時の挙動まで設計されています。',
    content: `
## エラー処理の標準構造
全ての主要なプロシージャに実装します。

\`\`\`vba
Sub MainProcess()
    ' エラーが発生したら ErrHandler ラベルに飛ぶ設定
    On Error GoTo ErrHandler

    ' --- メイン処理 ---
    Dim x As Long
    x = 100 / 0 ' テスト用エラー
    
    ' 正常終了時はここを通って抜ける（重要！）
    Exit Sub

ErrHandler:
    ' エラー内容を表示
    MsgBox "エラーが発生しました。" & vbCrLf & _
           "番号:" & Err.Number & vbCrLf & _
           "内容:" & Err.Description, vbCritical
           
    ' 必要に応じて後始末（画面更新の再開など）を行う
    Application.ScreenUpdating = True
End Sub
\`\`\`

## 禁止事項
*   \`On Error Resume Next\` の乱用（エラーを握りつぶし、原因不明のバグを生む）。
*   エラーハンドラを書かずに放置すること。
`
  },
  {
    id: 5,
    title: '可読性・保守性 (Readability)',
    description: '「半年後の自分」や「他のチームメンバー」が見ても理解できるコードを目指します。',
    content: `
## 1関数 ＝ 1目的
*   1つのプロシージャに行わせる処理は1つに絞ります。
*   **行数制限**: 目安として50行を超える場合は、処理を別のSub/Functionに分割します。

## マジックナンバー禁止
コード中に直接数値を書くのは避けます。

\`\`\`vba
' ❌ NG: 0.1 が何なのか、後で見た時に分からない
price = price * 1.1

' ✅ OK: 定数を使う
Const TAX_RATE As Double = 0.1
price = price * (1 + TAX_RATE)
\`\`\`

## 変数のスコープ
*   **グローバル変数（Public変数）**は可能な限り使用しません（どこで書き換えられたか追えなくなるため）。
*   変数は使う直前ではなく、プロシージャの先頭でまとめて宣言するか、使用範囲が狭い場合は近い場所で宣言します。
`
  },
  {
    id: 6,
    title: 'パフォーマンス規約 (Performance)',
    description: 'ユーザーを待たせないための、速度に関するルールです。',
    content: `
## ScreenUpdating の制御
大量のセル操作を行う前には画面更新を止めます。

\`\`\`vba
Sub HeavyProcess()
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual ' 自動計算も止める
    
    ' ... 重い処理 ...
    
    ' 必ず最後に戻す！
    Application.Calculation = xlCalculationAutomatic
    Application.ScreenUpdating = True
End Sub
\`\`\`

## オブジェクト操作の最適化
*   不要な \`.Select\` / \`.Activate\` は禁止。
    *   \`Range("A1").Select\` → \`Selection.Value = 1\` (❌ 遅い)
    *   \`Range("A1").Value = 1\` (✅ 速い)
*   ループ内でのセル読み書きは極力避け、配列(\`Variant\`)を活用する。
`
  },
  {
    id: 7,
    title: '教育・拡張性 (Education)',
    description: 'チーム全体のスキル向上のためのルールです。',
    content: `
## 解説コメント
チーム内で共有するコードや、後輩への引継ぎ用コードには、必ず「解説コメント」を付けます。
単なる動作説明ではなく、「なぜこのロジックを採用したか（背景）」を残すことが資産になります。

## 拡張性への配慮
将来の仕様変更に強いコードを書きます。
*   シート名やファイルパスはコードに埋め込まず、設定シートや定数で管理する。
*   似たような処理はコピペせず、共通関数化する。
`
  }
];

export const SYSTEM_INSTRUCTION_TUTOR = `
あなたは世界で最も優れたVBA（Excel Visual Basic for Applications）の専任講師です。
あなたの使命は、初心者から中級者の学習者を導き、彼らが実務で通用する堅牢で美しいコードを書けるようにすることです。

## 指導方針
1.  **肯定と共感**: ユーザーは初心者です。専門用語で突き放さず、まずは挑戦を称えてください。
2.  **具体例重視**: 抽象的な概念（オブジェクト指向など）は、必ず「タイヤキの型」や「住所録」などの比喩を用いて説明してください。
3.  **ベストプラクティス**: 古い書き方（Select/Selectionの多用など）は優しく指摘し、最新の書き方（直接参照、配列処理）を推奨してください。
4.  **コードブロック**: コードを提示する際は、必ずMarkdownのコードブロック（\`\`\`vba ... \`\`\`）を使用し、適切なインデントとコメントを付与してください。

## トーン＆マナー
*   親しみやすく、かつ頼りになる「先輩社員」のような口調。
*   「〜ですね！」「〜しましょう！」といった呼びかけを多用する。
*   日本語で回答する。
`;

export const VBA_CURRICULUM: Lesson[] = [
  // --- Week 1: 導入編 ---
  {
    id: 'week1-1',
    category: 'Week 1: 導入編',
    title: 'はじめの一歩：環境構築とVBEの完全理解',
    difficulty: 1,
    frequency: 3,
    content: `
# 1. Excel VBAとは何か？なぜ学ぶのか？
VBA (Visual Basic for Applications) は、ExcelなどのOffice製品を「内側から操る」ための魔法の言語です。
「毎週金曜日に1時間かけていた集計作業」が、ボタンひとつで「3秒」で終わるようになります。これは決して大袈裟ではありません。

# 2. 開発環境の準備（コックピットに座る）
プログラミングを始める前に、Excelの裏側にある「開発室」への扉を開ける必要があります。

1.  **開発タブの表示**:
    *   リボン（上部のメニュー）の何もないところを右クリック > [リボンのユーザー設定]。
    *   右側のリストにある [開発] にチェックを入れて [OK]。
    *   これで、画面上部に「開発」タブが現れます。

2.  **VBE (Visual Basic Editor) の起動**:
    *   ショートカットキー: \`Alt + F11\` （プロは必ずこちらを使います）
    *   マウス操作: [開発] タブ > [Visual Basic]
    *   開いた画面が VBE です。ここがあなたの仕事場になります。

3.  **標準モジュールの挿入**:
    *   コードを書くための「ノート」を用意します。
    *   VBEのメニュー [挿入] > [標準モジュール]。
    *   画面中央に白いエディタが表示されれば準備完了です。

# 3. Hello World（最初のプログラム）
伝統的な儀式として、PCに挨拶させてみましょう。
以下のコードをコピーして、VBEに貼り付けてください。

\`\`\`vba
Sub HelloWorld()
    ' これはコメントです。プログラムには影響しません。
    ' MsgBoxは、画面にメッセージを表示する命令です。
    MsgBox "Hello World"
End Sub
\`\`\`

**実行方法**:
コードの中にカーソル（点滅する縦棒）がある状態で、キーボードの \`F5\` キーを押します。
画面にメッセージボックスが表示されましたか？
おめでとうございます！あなたは今、Excelに命令を下し、従わせることに成功しました。
`
  },
  {
    id: 'week1-2',
    category: 'Week 1: 導入編',
    title: 'マクロ記録の功罪：自動生成コードの正体',
    difficulty: 1,
    frequency: 2,
    content: `
# マクロ記録とは？
あなたがExcelで行った操作（セルの色変え、文字入力など）を、Excel自身がVBAコードとして書き出してくれる機能です。
「開発」タブ > 「マクロの記録」で開始し、操作後に「記録終了」を押します。

# なぜ「マクロ記録」だけではダメなのか？
マクロ記録は便利ですが、生成されるコードには「無駄」が多く、「応用」が効きません。

## ❌ マクロ記録で生成されるコードの例
「セルA1を赤くする」という操作を記録すると、こうなります。

\`\`\`vba
Sub Macro1()
    Range("A1").Select                ' A1を選択して...
    With Selection.Interior           ' 選択範囲の背景について...
        .Pattern = xlSolid
        .PatternColorIndex = xlAutomatic
        .Color = 255                  ' 色を赤にして...
        .TintAndShade = 0             ' 影の設定をして...
        .PatternTintAndShade = 0      ' パターンの設定をして...
    End With
End Sub
\`\`\`
行数が多く、\`Select\`（選択）という動作が入っているため、処理が遅くなります。

## ✅ プロが書くコード
同じ処理を、VBAの文法を理解して書くとこうなります。

\`\`\`vba
Sub MakeItRed()
    Range("A1").Interior.Color = vbRed
End Sub
\`\`\`
たった1行です。
しかも、\`Select\` しないため、画面がチラつかず、高速に動作します。

**学習のゴール**:
マクロ記録は「辞書代わり」（書き方を忘れた時に調べる用）に使い、実際のコードは自分でスッキリと書けるようになることを目指しましょう。
`
  },

  // --- Week 2: 基本文法編① ---
  {
    id: 'week2-1',
    category: 'Week 2: 基本文法編①',
    title: '変数とデータ型：メモリという名の「箱」',
    difficulty: 2,
    frequency: 5,
    content: `
# 変数（Variable）とは？
データを入れておく「名前付きの箱」です。
箱を使うことで、データを再利用したり、計算結果を一時保存したりできます。

\`\`\`vba
Dim score As Long    ' "score" という名前の「整数の箱」を用意する（宣言）
score = 100          ' 箱に 100 を入れる（代入）
MsgBox score + 50    ' 箱の中身を使って計算する（表示：150）
\`\`\`

# なぜ型指定が必要なのか？ (Option Explicit)
VBAは変数を宣言しなくても使えてしまいますが、それは**非常に危険**です。
スペルミスがあってもエラーにならず、「中身が空っぽ」の新しい変数が勝手に作られてしまうからです。

**鉄の掟**:
モジュールの先頭に必ず \`Option Explicit\` と書いてください。
これを書くと、「宣言していない変数は使えない」モードになり、ミスを未然に防げます。
（VBEの [ツール] > [オプション] > [編集] > [変数の宣言を強制する] にチェックを入れると自動挿入されます）

## 主なデータ型（これだけ覚えればOK）
| 型名 | 接頭辞 | メモリ | 用途・解説 |
|---|---|---|---|
| **String** | str | 可変 | 文字列。"あいうえお" など。 |
| **Long** | i, n, lng | 4byte | 整数。昔の \`Integer\` は範囲が狭いので、今は \`Long\` 一択です。 |
| **Double** | dbl | 8byte | 小数。消費税計算などに使用。 |
| **Date** | dt | 8byte | 日付と時刻。 |
| **Boolean** | is, b | 2byte | True (真) または False (偽)。フラグ管理に。 |
| **Range** | rng | - | セルそのもの（オブジェクト）。 |
| **Worksheet** | ws | - | シートそのもの（オブジェクト）。 |

## ⚠️ 初心者の罠：Variant型
\`Dim x\` のように型を省略すると、自動的に \`Variant\`（万能型）になります。
何でも入って便利に見えますが、
1.  メモリを食う
2.  処理が遅い
3.  意図しないデータが入っても気づかない
というデメリットがあります。**意図的に使う場合以外は避けましょう。**
`
  },
  {
    id: 'week2-2',
    category: 'Week 2: 基本文法編①',
    title: '演算子と計算：PCに計算させる',
    difficulty: 1,
    frequency: 4,
    content: `
# 四則演算
プログラミングの世界でも、算数のルールは同じです。

\`\`\`vba
Dim a As Long, b As Long
a = 10
b = 3

Debug.Print a + b  ' 足し算: 13
Debug.Print a - b  ' 引き算: 7
Debug.Print a * b  ' 掛け算: 30
Debug.Print a / b  ' 割り算: 3.333...
Debug.Print a \\ b ' 割り算(商のみ): 3 (円記号またはバックスラッシュ)
Debug.Print a Mod b ' 割り算(余りのみ): 1
\`\`\`

**Point**:
\`Mod\`（余り）は、「偶数か奇数か判定する（2で割った余りが0か1か）」際によく使われます。

# 文字列の結合
文字列をつなぐときは \`&\` (アンパサンド) を使います。
\`+\` でも結合できますが、数値の足し算と混同してエラーになることがあるため、**VBAでは必ず \`&\` を使うのが鉄則**です。

\`\`\`vba
Dim firstName As String
Dim lastName As String
firstName = "太郎"
lastName = "山田"

' 良い例
MsgBox lastName & " " & firstName ' -> "山田 太郎"

' 数値と文字の結合も & なら自動変換してくれる
MsgBox "あなたの得点は " & 100 & " 点です"
\`\`\`

# 比較演算子
条件分岐で使います。
*   \`=\` : 等しい
*   \`<>\` : 等しくない（Not Equal）
*   \`>\`, \`<\` : 大きい、小さい
*   \`>=\`, \`<=\` : 以上、以下
`
  },

  // --- Week 3: 基本文法編② ---
  {
    id: 'week3-1',
    category: 'Week 3: 基本文法編②',
    title: '条件分岐：If文とSelect Caseの使い分け',
    difficulty: 2,
    frequency: 5,
    content: `
# If...Then...Else (基本中の基本)
条件によって処理を分けます。

\`\`\`vba
Dim score As Long
score = 85

If score >= 80 Then
    ' 条件が True のとき
    MsgBox "合格！"
    Cells(1, 1).Value = "Pass"
ElseIf score >= 60 Then
    ' 最初の条件が False で、この条件が True のとき
    MsgBox "惜しい！"
Else
    ' どの条件も False のとき
    MsgBox "不合格..."
    Cells(1, 1).Interior.Color = vbRed
End If
\`\`\`

**インデント（字下げ）の重要性**:
\`If\` と \`End If\` の間は、必ず \`Tab\` キーでインデントしてください。
インデントがないコードは、プログラマーにとって「読めない暗号」と同じです。

# Select Case (多分岐の整理)
「ある変数の値」によって、3つ以上の分岐がある場合は、If文よりこちらが見やすいです。

\`\`\`vba
Dim rank As String
rank = "A"

Select Case rank
    Case "A"
        MsgBox "大変良い"
    Case "B", "C"
        MsgBox "良い"
    Case "D" To "F"
        MsgBox "もっと頑張りましょう"
    Case Else
        MsgBox "評価不能"
End Select
\`\`\`
`
  },
  {
    id: 'week3-2',
    category: 'Week 3: 基本文法編②',
    title: '繰り返し処理：ForとDoの完全攻略',
    difficulty: 3,
    frequency: 5,
    content: `
# For...Next (回数が決まっている場合)
最もよく使います。「1行目から100行目まで」のように範囲が明確な場合に適しています。

\`\`\`vba
Dim i As Long
' i が 1, 2, 3 ... 10 と変化しながら繰り返す
For i = 1 To 10
    ' A列(1列目)に連番を振る
    Cells(i, 1).Value = i 
Next i
\`\`\`

# For Each (コレクションを処理する場合)
**実務での使用頻度No.1**です。
「ブック内の全シート」「選択範囲の全セル」など、個数が不明でも「あるだけ全部」処理します。

\`\`\`vba
Dim ws As Worksheet
' ブックにある全てのシートに対して処理
For Each ws In Worksheets
    Debug.Print ws.Name
    ' もし非表示シートなら表示する
    If ws.Visible = False Then ws.Visible = True
Next ws
\`\`\`

# Do...Loop (条件で繰り返す場合)
「データが空になるまで」「合計が1000を超えるまで」など、回数が読めない場合に使います。

\`\`\`vba
Dim r As Long
r = 1
' A列のセルが空文字("")でない間、繰り返す
Do While Cells(r, 1).Value <> ""
    ' 処理内容
    Cells(r, 2).Value = "処理済"
    
    r = r + 1 ' ⚠️ これを忘れると無限ループになりExcelが固まります！
Loop
\`\`\`

**無限ループからの脱出**:
もしマクロが止まらなくなったら、キーボードの \`Esc\` キーか \`Ctrl + Break\` キーを連打してください。
`
  },

  // --- Week 4: Excel操作編① ---
  {
    id: 'week4-1',
    category: 'Week 4: Excel操作編①',
    title: 'セルの操作：RangeとCellsの使い分け',
    difficulty: 2,
    frequency: 5,
    content: `
# Range vs Cells
VBAでセルを指定する方法は2つあります。適材適所で使い分けましょう。

## 1. Rangeプロパティ ("A1"形式)
人間にとって直感的です。固定のセルや範囲を指定するのに向いています。
\`\`\`vba
Range("A1").Value = 100
Range("A1:C3").Value = "Test" ' 範囲一括入力
Range("A:A").Delete           ' A列全体削除
\`\`\`

## 2. Cellsプロパティ (行番号, 列番号)
**ループ処理で最強**の力を発揮します。
Cells(行, 列) なので、\`Cells(2, 3)\` は C2セル (2行目, 3列目) です。

\`\`\`vba
Dim i As Long
For i = 1 To 10
    ' A列(1列目)を上から順に処理
    Cells(i, 1).Value = i * 10 
Next i
\`\`\`

# オフセット (Offset)
「基準セルから〇個隣」という指定方法です。相対的な位置関係で操作したい時に使います。

\`\`\`vba
Dim rng As Range
Set rng = Range("B2")

' B2から見て「1つ下、1つ右」＝ C3
rng.Offset(1, 1).Value = "ここ！"

' 見出し行の下からデータを貼り付けたい時などによく使います
\`\`\`

# リサイズ (Resize)
範囲のサイズを変更します。
\`\`\`vba
' A1を起点に、縦3行・横2列の範囲 (A1:B3)
Range("A1").Resize(3, 2).Select
\`\`\`
`
  },
  {
    id: 'week4-2',
    category: 'Week 4: Excel操作編①',
    title: '書式設定とSpecialCellsの魔術',
    difficulty: 3,
    frequency: 4,
    content: `
# セルの装飾
レポート作成の自動化などで必須です。

\`\`\`vba
With Range("A1")
    .Value = "重要"
    .Font.Bold = True              ' 太字
    .Font.Color = vbRed            ' 文字色：赤
    .Interior.Color = RGB(255, 255, 0) ' 背景色：黄色
    .Borders.LineStyle = xlContinuous  ' 罫線：実線
End With
\`\`\`

# SpecialCells (ジャンプ機能)
Excelの機能「ジャンプ > セル選択」と同じです。
「空白セルだけ」「数式が入っているセルだけ」を一括操作できます。**ループで1つずつ探すより圧倒的に高速**です。

\`\`\`vba
' A列の「空白セル」だけに "未入力" と入れる
On Error Resume Next ' 該当セルがない場合のエラー回避
Range("A:A").SpecialCells(xlCellTypeBlanks).Value = "未入力"
On Error GoTo 0
\`\`\`

# Union と Intersect
複数の範囲を扱います。
*   **Union**: 飛び飛びの範囲を結合する (A1 と C3 をセットにする)
*   **Intersect**: 重なっている部分を取得する (選択範囲とA列の重なりなど)

\`\`\`vba
Dim target As Range
' A1:A10 と C1:C10 を同時に赤くする
Set target = Union(Range("A1:A10"), Range("C1:C10"))
target.Interior.Color = vbRed
\`\`\`
`
  },

  // --- Week 5: Excel操作編② ---
  {
    id: 'week5-1',
    category: 'Week 5: Excel操作編②',
    title: 'シート操作の極意：CodeNameを使え',
    difficulty: 3,
    frequency: 4,
    content: `
# シートの指定方法：3つの流儀
プロが現場でどうシートを指定しているか？これには明確な序列があります。

## 1. シート名で指定 (Worksheets("Data"))
\`\`\`vba
Worksheets("Data").Range("A1").Value = 1
\`\`\`
ユーザーがシート名を「Data_旧」などに変えると、**エラーで止まります**。脆いコードです。

## 2. インデックスで指定 (Worksheets(1))
左から何番目か、で指定します。
ユーザーがシートの順番を並び替えると、**別のシートを処理してしまいます**。危険です。

## 3. オブジェクト名 (CodeName) で指定 ✅推奨
VBEの左側（プロジェクトエクスプローラー）を見てください。
\`Sheet1 (Data)\` のように表示されています。この \`Sheet1\` がオブジェクト名です。
\`\`\`vba
Sheet1.Range("A1").Value = 1
\`\`\`
これなら、ユーザーがシート名をどう変更しようが、順番を変えようが、**コードは動き続けます**。
実務ツールでは、可能な限りこの方法を使います（プロパティウィンドウで名前を \`wsData\` 等に変更するのが通例です）。

# シートの操作
\`\`\`vba
' シート追加（一番右に）
Worksheets.Add After:=Worksheets(Worksheets.Count)

' シート削除（警告メッセージを消すテクニック）
Application.DisplayAlerts = False ' 警告OFF
Worksheets("Temp").Delete
Application.DisplayAlerts = True  ' 警告ON（必ず戻す！）
\`\`\`
`
  },
  {
    id: 'week5-2',
    category: 'Week 5: Excel操作編②',
    title: 'ブック間のデータ転記と集約',
    difficulty: 3,
    frequency: 4,
    content: `
# 異なるブックを操作する
マクロが書かれているブックは \`ThisWorkbook\`、現在最前面にあるブックは \`ActiveWorkbook\` です。
しかし、これらに頼らず、**必ず変数に入れて管理**します。

\`\`\`vba
Sub CopyDataBetweenBooks()
    Dim wbSrc As Workbook
    Dim wbDst As Workbook
    
    ' マクロを書いているこのブックを転記先に設定
    Set wbDst = ThisWorkbook
    
    ' データファイルを開いて、変数にセット
    Set wbSrc = Workbooks.Open("C:\\Data\\MonthlySales.xlsx")
    
    ' 転記処理（wbSrc から wbDst へ）
    ' 値のみ貼り付けるのが安全です
    wbDst.Sheets("Summary").Range("A1").Value = _
        wbSrc.Sheets("Sales").Range("A1").Value
        
    ' 用が済んだら閉じる（保存しない）
    wbSrc.Close SaveChanges:=False
End Sub
\`\`\`

**実務Tips**:
\`Workbooks.Open\` は、ファイルが見つからないとエラーになります。\`Dir\`関数などでファイル存在チェックを行うのが定石です（Week 9で解説）。
`
  },

  // --- Week 6: 応用構造編① ---
  {
    id: 'week6-1',
    category: 'Week 6: 応用構造編①',
    title: '配列 (Array)：100倍速のスピードスター',
    difficulty: 4,
    frequency: 4,
    content: `
# なぜVBAは「遅い」と言われるのか？
VBAそのものが遅いのではありません。「Excelとの会話（セルの読み書き）」が遅いのです。
セルに1回書き込む時間を「1秒」と仮定すると、1万行のデータを処理するには「1万秒（約3時間）」かかります。
これを「1回」で済ませる技術が配列です。

# 配列を使った高速化ロジック
1.  **セル範囲 → 配列**: データを一瞬でメモリ上の配列に吸い上げる。
2.  **配列内で計算**: メモリ上で超高速に処理する。
3.  **配列 → セル範囲**: 結果を一瞬で書き戻す。

\`\`\`vba
Sub ArrayBoost()
    Dim arr As Variant
    Dim i As Long
    Dim startTime As Double
    
    ' A1:B10000 のデータを配列に格納（一瞬です）
    arr = Range("A1:B10000").Value
    
    ' メモリ内でループ処理
    ' 配列は arr(行, 列) でアクセスします
    For i = 1 To UBound(arr, 1) ' UBoundは配列の最大行数
        ' B列(2列目)に、A列(1列目)の2倍の値を入れる
        arr(i, 2) = arr(i, 1) * 2
    Next i
    
    ' 結果をセルに書き戻す（これも一瞬です）
    Range("A1:B10000").Value = arr
End Sub
\`\`\`
これで、数分かかっていた処理が **0.1秒** になります。これが「中級者」への壁です。

# 動的配列 (ReDim)
サイズが決まっていない配列を作る場合に使います。
\`\`\`vba
Dim list() As String
Dim count As Long
count = 5

ReDim list(1 To count) ' 箱のサイズを5個に設定
list(1) = "Apple"

' サイズ変更（Preserveをつけると中身を消さずに拡張可能）
ReDim Preserve list(1 To 10)
\`\`\`
`
  },
  {
    id: 'week6-2',
    category: 'Week 6: 応用構造編①',
    title: 'Scripting.Dictionary：最強の検索ツール',
    difficulty: 4,
    frequency: 5,
    content: `
# Dictionary（連想配列）とは？
「キー（Key）」と「値（Item）」をセットで保存する箱です。
Excel標準の \`VLOOKUP\` 関数をメモリ上で超高速に行うイメージです。

**主な用途**:
1.  **重複排除**: リストからユニークな一覧を作る。
2.  **集計**: 「商品ごとの売上合計」などを一瞬で計算する。
3.  **検索**: IDから名称を高速に引く。

# 使い方
標準機能ではないため、\`CreateObject\` で呼び出します。

\`\`\`vba
Sub DictionaryDemo()
    Dim dic As Object
    Set dic = CreateObject("Scripting.Dictionary")
    
    ' データの追加 (Key, Item)
    dic.Add "A001", "佐藤"
    dic.Add "A002", "鈴木"
    
    ' 重復チェック (Exists)
    If Not dic.Exists("A001") Then
        dic.Add "A001", "田中" ' キーが重複するとエラーになるのでチェック必須
    End If
    
    ' 値の取り出し
    MsgBox dic("A002") ' -> "鈴木"
    
    ' 値の書き換え（集計などで使う）
    dic("A001") = "佐藤（リーダー）"
End Sub
\`\`\`

**実務での集計パターン**:
\`\`\`vba
' 売上データ(Product, Amount)をループして集計
For i = 2 To LastRow
    product = Cells(i, 1).Value
    amount = Cells(i, 2).Value
    
    If dic.Exists(product) Then
        dic(product) = dic(product) + amount ' 加算
    Else
        dic.Add product, amount ' 新規登録
    End If
Next i
' これで dic には商品ごとの合計が入っています
\`\`\`
`
  },

  // --- Week 7: 応用構造編② ---
  {
    id: 'week7-1',
    category: 'Week 7: 応用構造編②',
    title: 'エラー処理：プロのコードは止まらない',
    difficulty: 3,
    frequency: 5,
    content: `
# 想定外を想定する
自分だけが使うツールならエラーで止まってもいいですが、配布するツールでエラー画面（デバッグモード）が表示されるのは**品質事故**です。

# 基本パターン：On Error GoTo
エラーが発生したら、専用の処理場所（ラベル）にジャンプさせます。

\`\`\`vba
Sub RobustMacro()
    On Error GoTo ErrHandler ' エラー監視開始

    ' --- メイン処理 ---
    Dim x As Long
    x = 100 / 0 ' ここでエラー発生！ -> ErrHandlerへ飛ぶ
    
    ' 正常終了時はここで抜ける
    Exit Sub

ErrHandler:
    ' ユーザーに分かりやすく伝える
    MsgBox "予期せぬエラーが発生しました。" & vbCrLf & _
           "エラー番号: " & Err.Number & vbCrLf & _
           "内容: " & Err.Description, vbCritical
           
    ' 後始末（ファイルを閉じる、画面更新を戻す等）
    Application.ScreenUpdating = True
End Sub
\`\`\`

# 独自エラーの発生 (Err.Raise)
入力チェックなどで、意図的にエラーを起こして処理を中断させたい場合に使います。
\`\`\`vba
If Cells(1, 1).Value = "" Then
    ' 50000番以降はユーザー定義エラーに使えます
    Err.Raise 50001, , "必須項目が入力されていません！"
End If
\`\`\`
`
  },
  {
    id: 'week7-2',
    category: 'Week 7: 応用構造編②',
    title: 'Functionプロシージャ：部品化のすすめ',
    difficulty: 3,
    frequency: 4,
    content: `
# Sub と Function の違い
*   **Sub**: 何か動作を行う（値を返さない）。
*   **Function**: 計算や処理を行い、**結果を呼び出し元に返す**。

Excelのワークシート関数（SUMなど）を自作するイメージです。

# 例：消費税計算関数
\`\`\`vba
' 呼び出し側
Sub Main()
    Dim price As Long
    price = CalculateTax(1000) ' 関数の結果を受け取る
    MsgBox "税込: " & price
End Sub

' 機能側（部品）
Function CalculateTax(amount As Long) As Long
    ' 関数名 = 戻り値 で値を返す
    CalculateTax = amount * 1.1
End Function
\`\`\`

# ByVal と ByRef (参照渡しと値渡し)
引数の渡し方には2種類あります。
*   **ByRef (デフォルト)**: 変数そのものを渡す。関数内で値を変更すると、呼び出し元の変数も変わる。
*   **ByVal**: 変数のコピーを渡す。関数内で変更しても、呼び出し元には影響しない。

**原則**:
意図しない書き換えを防ぐため、可能な限り \`ByVal\` を明記するのが安全です。

\`\`\`vba
Function AddOne(ByVal n As Long) As Long
    n = n + 1
    AddOne = n
End Function
\`\`\`
`
  },

  // --- Week 8: 実務活用編① ---
  {
    id: 'week8-1',
    category: 'Week 8: 実務活用編①',
    title: 'データ集計自動化：最終行取得の決定版',
    difficulty: 3,
    frequency: 5,
    content: `
# 最終行の取得 (Endプロパティ)
データが毎回何行あるか分からない場合、「一番下のデータ」を見つける必要があります。
Excel操作でいう \`Ctrl + ↑\` キーの動きを利用します。

\`\`\`vba
Dim lastRow As Long
' シートの一番下(Rows.Count = 1048576)から、上に向かって探索
lastRow = Cells(Rows.Count, 1).End(xlUp).Row

MsgBox "データは " & lastRow & " 行目まであります"
\`\`\`

## ⚠️ 落とし穴
*   データが1件もない（ヘッダーのみ）場合、ヘッダー行数（1行目）が返ります。
*   途中に空白行があっても、一番下から検索するので正しく最下端を取れます（これが \`End(xlDown)\` より推奨される理由です）。

# オートフィルタによる抽出とコピー
ループで1行ずつ判定するより、フィルタ機能を使ったほうが高速な場合があります。

\`\`\`vba
With Sheet1.Range("A1")
    .AutoFilter Field:=1, Criteria1:="東京" ' A列を"東京"で絞り込み
    
    ' 可視セル（見えているセル）のみコピー
    .CurrentRegion.SpecialCells(xlCellTypeVisible).Copy
    
    ' 別シートに貼り付け
    Sheet2.Range("A1").PasteSpecial xlPasteValues
    
    .AutoFilter ' フィルタ解除
End With
\`\`\`
`
  },
  {
    id: 'week8-2',
    category: 'Week 8: 実務活用編①',
    title: '自動レポート作成：グラフとピボット',
    difficulty: 4,
    frequency: 3,
    content: `
# グラフの自動生成
データの範囲が変わるたびにグラフを作り直すのは面倒です。マクロなら一瞬です。

\`\`\`vba
Sub CreateChart()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    ' 既存のグラフがあれば削除（リセット）
    If ws.ChartObjects.Count > 0 Then ws.ChartObjects.Delete
    
    ' グラフの追加
    With ws.Shapes.AddChart2(201, xlColumnClustered).Chart
        .SetSourceData Source:=ws.Range("A1").CurrentRegion
        .ChartTitle.Text = "月別売上推移"
        .Axes(xlValue).HasTitle = True
        .Axes(xlValue).AxisTitle.Text = "金額(円)"
    End With
End Sub
\`\`\`

# ピボットテーブルの更新
データ元をテーブル化しておき、ピボットを更新するだけの設計が最もシンプルで堅牢です。

\`\`\`vba
Sub RefreshPivot()
    Dim pt As PivotTable
    ' "Summary"シートにある全てのピボットテーブルを更新
    For Each pt In Worksheets("Summary").PivotTables
        pt.RefreshTable
    Next pt
End Sub
\`\`\`
すべてをVBAで作ろうとせず、「Excelの機能 + VBAによる更新」というハイブリッド構成にするのが、メンテナンスしやすいツールのコツです。
`
  },

  // --- Week 9: 実務活用編② ---
  {
    id: 'week9-1',
    category: 'Week 9: 実務活用編②',
    title: 'ファイル操作：FSOと文字コードの壁',
    difficulty: 4,
    frequency: 4,
    content: `
# FileSystemObject (FSO)
VBA標準の \`Open\` ステートメントは古いので、より高機能な FSO を使います。
ファイルの移動、コピー、削除、フォルダ作成などが直感的に行なえます。

\`\`\`vba
Dim fso As Object
Set fso = CreateObject("Scripting.FileSystemObject")

' フォルダ内の全ファイルをループ処理
Dim f As Object, folderPath As String
folderPath = "C:\\Data\\"

For Each f In fso.GetFolder(folderPath).Files
    ' 拡張子が .csv のものだけ処理
    If LCase(fso.GetExtensionName(f.Name)) = "csv" Then
        Debug.Print "処理中: " & f.Name
    End If
Next f
\`\`\`

# 文字コードの壁 (UTF-8問題)
FSOの弱点は、**「Shift-JIS」以外のファイル（UTF-8など）を読み込むと文字化けする**ことです。
現代のWebシステムから吐き出されるCSVは多くがUTF-8です。
これに対応するには \`ADODB.Stream\` を使います。

\`\`\`vba
Sub ReadUTF8()
    Dim adoSt As Object
    Set adoSt = CreateObject("ADODB.Stream")
    
    With adoSt
        .Charset = "UTF-8" ' ここで文字コード指定
        .Open
        .LoadFromFile "C:\\Data\\utf8_data.csv"
        
        ' 全文読み込み
        Dim textContent As String
        textContent = .ReadText
        
        .Close
    End With
    
    ' 改行で分割して配列へ
    Dim lines As Variant
    lines = Split(textContent, vbCrLf)
End Sub
\`\`\`
`
  },
  {
    id: 'week9-2',
    category: 'Week 9: 実務活用編②',
    title: 'Outlook連携：メール送信オートメーション',
    difficulty: 4,
    frequency: 3,
    content: `
# Excelからメールを送る
請求書のPDFを添付して、顧客リスト全員に送信する…といった作業はVBAの独壇場です。
Outlookアプリケーションを操作します。

\`\`\`vba
Sub SendMailDemo()
    Dim appOutlook As Object
    Dim mailItem As Object
    
    ' Outlookが起動していなければ起動し、接続する
    On Error Resume Next
    Set appOutlook = GetObject(, "Outlook.Application")
    If appOutlook Is Nothing Then
        Set appOutlook = CreateObject("Outlook.Application")
    End If
    On Error GoTo 0
    
    ' 新規メール作成
    Set mailItem = appOutlook.CreateItem(0) ' 0 = MailItem
    
    With mailItem
        .To = "customer@example.com"
        .CC = "boss@company.com"
        .Subject = "【請求書】10月分のご案内"
        
        ' HTML形式で本文を作成可能
        .BodyFormat = 2 ' olFormatHTML
        .HTMLBody = "<b>佐藤様</b><br>いつもお世話になっております。<br>..."
        
        ' ファイル添付
        .Attachments.Add "C:\\Docs\\Invoice_10.pdf"
        
        .Display ' 画面表示（いきなり .Send せず、一旦表示するのが安全）
    End With
End Sub
\`\`\`

**セキュリティ警告**:
会社のポリシーによっては、プログラムからのメール送信時に警告が出たり、ブロックされたりする場合があります。
`
  },

  // --- Week 10: 発展編 ---
  {
    id: 'week10-1',
    category: 'Week 10: 発展編',
    title: 'クラスモジュール：タイヤキの金型理論',
    difficulty: 5,
    frequency: 2,
    content: `
# クラスモジュールとは？
VBAの中で最も難解とされ、多くの学習者が挫折する壁です。
しかし、概念さえ掴めば「これなしではツールが作れない」と思うほど便利になります。

## 概念図：タイヤキ屋の例
*   **標準モジュール**: タイヤキを一個一個、皮を敷いてアンコを乗せて…と手作業で作る場所。
*   **クラスモジュール (Class1)**: **「タイヤキの金型」**の設計図。
*   **オブジェクト (インスタンス)**: 金型からポンと生み出された**「タイヤキそのもの」**。

金型（クラス）があれば、
\`Dim taiyaki1 As New Class1\`
\`Dim taiyaki2 As New Class1\`
のように、変数としてタイヤキを量産できます。

## 実践：Customerクラスを作る
「顧客」というデータを扱う金型を作ってみましょう。

1.  VBEメニュー [挿入] > [クラスモジュール]。
2.  プロパティウィンドウでオブジェクト名を \`Customer\` に変更。

\`\`\`vba
' --- Customer クラスの中身 ---
Option Explicit

' 内部変数（金型の内側）。Privateなので外からは見えません。
Private pId As String
Private pName As String

' プロパティ (Let): データの書き込み口
' ここで入力チェックができるのがクラスの最大のメリットです！
Public Property Let Id(value As String)
    If Len(value) <> 4 Then
        Err.Raise 5000, , "IDは4桁でなければなりません"
    End If
    pId = value
End Property

Public Property Let Name(value As String)
    pName = value
End Property

' プロパティ (Get): データの読み出し口
Public Property Get Name() As String
    Name = pName
End Property

' メソッド: この顧客自身が行う動作
Public Sub SendDMMail()
    MsgBox pName & " 様にDMメールを送信しました。"
End Sub
\`\`\`

## 呼び出し側（標準モジュール）
\`\`\`vba
Sub TestClass()
    Dim c1 As Customer
    Set c1 = New Customer ' 金型から実体を作成（インスタンス化）
    
    ' IDを入れる（もし "123" と入れると、クラス側でエラーにしてくれる！）
    c1.Id = "A001"
    c1.Name = "山田太郎"
    
    ' メソッド実行
    c1.SendDMMail
End Sub
\`\`\`

**メリット**:
データ（ID, 名前）と処理（DM送信）がセットで管理できるため、変数が散らばらず、大規模なツールでも見通しが良くなります。
`
  },
  {
    id: 'week10-2',
    category: 'Week 10: 発展編',
    title: '究極の高速化テクニック：限界への挑戦',
    difficulty: 4,
    frequency: 4,
    content: `
# 3大高速化呪文
処理速度に不満がある場合、まずこの呪文を唱えます。

\`\`\`vba
Sub BoostSpeed()
    ' 1. 画面描画を停止 (効果：大)
    ' パラパラ漫画のように画面が動くのを止め、裏で処理させます。
    Application.ScreenUpdating = False
    
    ' 2. 自動計算を停止 (効果：特大)
    ' セルに値を入れるたびに全数式が再計算されるのを防ぎます。
    Application.Calculation = xlCalculationManual
    
    ' 3. イベント発生を停止
    ' セル変更時に動く別のマクロなどを止めます。
    Application.EnableEvents = False
    
    On Error GoTo Cleanup ' エラーでも必ず設定を戻す！
    
    ' --- 重い処理 ---
    
Cleanup:
    ' ⚠️ 必ず元に戻すこと！
    ' これを忘れると、Excelが計算しなくなったり、フリーズしたように見えます。
    Application.EnableEvents = True
    Application.Calculation = xlCalculationAutomatic
    Application.ScreenUpdating = True
End Sub
\`\`\`

# その他のテクニック
*   **Withステートメント**:
    オブジェクトへの「アクセス権」を一度だけ取得し、使い回すことで高速化します。
    「ドット（.）」へのアクセスは意外とコストがかかるのです。

*   **文字列結合の高速化**:
    \`s = s & "abc"\` を1万回繰り返すと遅くなります。
    \`Mid\` ステートメントを使ったり、配列に溜めてから \`Join\` 関数で結合するのが最速です。

*   **Variant配列アクセス**:
    Week 6で紹介した「セル範囲を一気に配列へ」が最強のテクニックです。これを超える高速化手法は基本的にありません。
`
  }
];