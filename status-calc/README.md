# モンスト ステータス計算ツール

モンスターのステータス（攻撃力・スピード）と許容範囲、上限数、モンスポット、使用する等級を指定し、条件を満たすわくわくの実の組み合わせパターンを逆算・一覧表示するツールです。

## ファイル構成

```text
monst/status-calc/
├── index.html        # メイン画面
├── README.md         # 本ドキュメント
└── ts/
    ├── app.ts        # 状態管理・UI操作制御
    ├── logic.ts      # 組み合わせ探索・ステータス計算ロジック
    └── constants.ts  # わくわくの実・モンスポット加算値マスタ定義
```

## トップページへのリンク追加例 (`monst/index.html`)

`vite.config.mjs` の自動検出により `monst/status-calc/index.html` は自動的にマルチページビルドへ組み込まれます。トップページから遷移できるようにする場合は、`monst/index.html` のツール一覧内に以下を追加してください。

```html
<a
  href="./status-calc/"
  class="block p-5 bg-slate-800 hover:bg-slate-700/70 rounded-lg border border-slate-700 transition group"
>
  <div class="flex items-center justify-between">
    <h2
      class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors"
    >
      ステータス計算ツール
    </h2>
    <span class="text-slate-500 group-hover:translate-x-1 transition-transform"
      >→</span
    >
  </div>
  <p class="text-slate-400 text-sm mt-1">
    目標の攻撃力・スピード範囲に収まるわくわくの実の組み合わせを逆算します。
  </p>
</a>
```
