# monst

モンスターストライク関連の各種ツールを管理するリポジトリです。

GitHub Pages上で公開されている、マルチページ構成のWebアプリケーションです。

## プロジェクト構成

主なファイル構成は以下のようになっています。各種ツールの説明はそれぞれの README.md をご覧ください。

```
monst/
├── index.html                  # トップページのエントリーポイント
├── rank-calc/                  # ランク計算ツール
├── status-calc/                # ステータス計算ツール
├── src/
│   ├── components/             # 汎用UIコンポーネント
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

### VS Code (Dev Containers) を使った開発

ホスト (手元) 環境の Node.js を汚さず、コンテナ内で直接エディタの補完や型チェックを完全に効かせて開発したい場合は、`.devcontainer/devcontainer.json` による Dev Containers を利用できます。

1. VS Code に拡張機能「Dev Containers」をインストールします。
2. プロジェクトを VS Code で開きます。
3. 画面左下のアイコン (またはコマンドパレット) から `Dev Containers: Reopen in Container` を実行します。
4. 自動的にコンテナがビルドされ、接続と同時に依存関係のインストールや開発サーバーの起動が行われます。

## Viteのマルチページ自動検出

`vite.config.mjs` では `fast-glob` を使用して、リポジトリ内のすべての `index.html` (ルート直下および各サブディレクトリ内) を自動的に検出し、ビルドのエントリーポイント (`rollupOptions.input`) として登録する設定になっています。

新しいツールやサブページを追加する際は、新規ディレクトリを作成してその中に `index.html` を配置するだけで自動的にビルド対象に含まれるため、`vite.config.mjs` を手動で書き換える必要はありません。

## CI/CD

このリポジトリでは、`.github/workflows/deploy.yml` を用いたGitHub Actionsによる自動デプロイが設定されています。

`main` ブランチへ変更がマージされると、自動的にビルドとGitHub Pagesへのデプロイが実行されます。

ビルド成果物 (`dist/` 内のファイル群) は `.gitignore` で除外されており、リポジトリに手動でpushする必要はありません。ローカルやDockerでの確認は、あくまで手元でのテスト用として行います。

## ライセンス

このプロジェクトのライセンスについては `LICENSE` ファイルをご確認ください。
