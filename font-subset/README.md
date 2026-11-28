# フォントサブセット作成用ディレクトリ

プロジェクトルートで以下を実行すると、`font-subset/fonts/` 下のフォントファイルから使用文字だけを抽出したサブセットを `public/fonts/` 下に生成します。

見出し文言やツール一覧（`src/tools.ts`）を追加・変更した場合は、再度実行してください。

```bash
docker compose -f docker-compose.font-subset.yml up --build
```
