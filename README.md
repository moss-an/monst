# monst

モンスターストライク関連の各種ツールを管理するリポジトリです。

GitHub Pages (github.io) 上で公開されている、マルチページ構成のWebアプリケーションです。

## プロジェクト構成

主なファイル構成は以下のようになっています。各種ツールの説明はそれぞれの README.md をご覧ください。

```
monst/
├── index.html                  # トップページのエントリーポイント
├── rank-calc/                  # ランク計算ツール
├── src/
│   └── input.css               # スタイル(Tailwind CSS)
├── Dockerfile                  # Dockerイメージ定義
├── docker-compose.yml          # 開発サーバー構築用Docker Compose
├── docker-compose.build.yml    # ビルド用Docker Compose
├── vite.config.mjs             # Viteの設定ファイル(マルチページ対応)
└── package.json                # 依存関係とスクリプト定義
```

## ローカルでの開発・確認方法

Node.js環境を直接利用して、ローカルで確認やビルドを行うことができます。

1. 依存パッケージをインストールします。

   ```bash
   npm install
   ```

2. 開発サーバーを起動します。

   ```bash
   npm run dev
   ```

3. ブラウザで表示されたローカルURL (例: `http://localhost:5173`) にアクセスします。

4. ビルドエラーが起こらないかの確認は、以下のコマンドで可能です。
   ```bash
   npm run build
   ```

## Docker環境での開発・確認方法

Docker環境で、コンテナを使った確認やビルドを行うことができます。

1. 開発サーバーを起動します。

   ```bash
   docker compose up --build
   ```

2. ターミナルで表示されたローカルURL (例: `http://localhost:5173`) にアクセスします。

3. ビルドエラーが起こらないかの確認は、以下のコマンドで可能です。
   ```bash
   docker compose -f docker-compose.build.yml up --build
   ```

## Viteのマルチページ設定に関する注意点

Viteはデフォルト状態ではシングルページアプリケーション (SPA) として動作するため、エントリーポイントが1つ (`index.html`) に制限されます。

今回のように、トップページ (`index.html`) とサブページ (例: `rank-calc/index.html`) を持つ**マルチページ構成**でGitHub Pagesなどにデプロイ・公開する場合、追加したHTMLファイルをViteのビルドターゲットに含めるため、`vite.config.mjs` の `rollupOptions.input` に各エントリーポイントを明示的に追記・設定する必要があります。

設定例 (`vite.config.mjs`):

```javascript
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        rankCalc: resolve(__dirname, "rank-calc/index.html"),
      },
    },
  },
});
```

新しいサブページを追加・拡張する際は、必ずこの `vite.config.mjs` への追加を忘れないよう注意してください。

## CI/CD

このリポジトリでは、`.github/workflows/deploy.yml` を用いたGitHub Actionsによる自動デプロイが設定されています。

- `main` ブランチへ変更がマージされると、自動的にビルドとGitHub Pagesへのデプロイが実行されます。
- ビルド成果物 (`dist/` 内のファイル群) は `.gitignore` で除外されており、リポジトリに手動で push する必要はありません。ローカルやDockerでの確認は、あくまで手元でのテスト用として行います。

## ライセンス

このプロジェクトのライセンスについては `LICENSE` ファイルをご確認ください。
