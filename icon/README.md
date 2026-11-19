# アイコン画像作成用ディレクトリ

プロジェクトルートで以下を実行すると、`public/favicon.ico` を生成します。

検索エンジンでの検索結果で表示されるアイコンです。

基本的にドメイン単位で1つのアイコンのため、別途 `user.github.io` リポジトリ側に `favicon.ico` を配置し、HTMLに参照を明記することを推奨します。

アイコン画像を編集したい場合は、本ディレクトリのファイルを編集してください。

```bash
docker compose -f docker-compose.icon.yml up --build
```
