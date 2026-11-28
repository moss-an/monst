# フォントサブセット作成用ディレクトリ

プロジェクトルートで以下を実行すると、`font-subset/fonts/reggae-one-v20-japanese_latin-regular.woff2` から使用文字だけを抽出した `public/fonts/reggae-one-subset.woff2` を生成します。

見出し文言やツール一覧（`src/tools.ts`）を追加・変更した場合は、再度実行してください。

```bash
docker compose -f docker-compose.font-subset.yml up --build
```
