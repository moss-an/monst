# アイコン画像作成用ディレクトリ

プロジェクトルートで以下を実行すると、`public/` 配下に次のアイコン画像を生成します。

- `favicon.ico`: 検索エンジンでの検索結果で表示されるアイコンです（48x48, 32x32, 16x16）。
- `apple-touch-icon.png`: iOS Safari のお気に入りやホーム画面追加時に表示されるアイコンです（180x180）。

`favicon.ico` は基本的にドメイン単位で1つのアイコンのため、別途 `user.github.io` リポジトリ（ドメイン直下）側に `favicon.ico` をコピー配置する前提です。検索エンジンにはそれを読み込ませるように `src/head-config.ts` で静的に指定しています。

アイコン画像を編集したい場合は、本ディレクトリのファイルを編集してください。

```bash
docker compose -f docker-compose.icon.yml up --build
```
