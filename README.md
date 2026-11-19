# monst

モンスターストライク（モンスト）関連の各種ツールを管理するリポジトリです。

GitHub Pages上で公開されている、マルチページ構成のWebアプリケーションです。

## プロジェクト構成

主なファイル構成は以下のようになっています。各種ツールの説明はそれぞれの `README.md` をご覧ください。

```
monst/
├── index.html                  # トップページのエントリーポイント
├── rank-calc/                  # ランク上げ計算ツール
├── score-calc/                 # スコア計算ツール
├── status-calc/                # ステータス計算ツール
├── src/
│   ├── common.ts               # 全ページ共通の初期化エントリ
│   ├── components/             # 汎用UIコンポーネント
│   ├── tools.ts                # ツール一覧の定義
│   ├── head-config.ts          # 各ページのheadタグ定義
│   └── input.css               # スタイル
├── Dockerfile                  # 開発環境用Dockerイメージ定義
├── docker-compose.yml          # 開発サーバー構築用Docker Compose
├── docker-compose.build.yml    # ビルド確認用Docker Compose
├── vite.config.mts             # Viteの設定ファイル（マルチページ対応）
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

3. ブラウザで表示されたローカルURL（例: `http://localhost:5173`）にアクセスします。

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

2. ターミナルで表示されたローカルURL（例: `http://localhost:5173`）にアクセスします。

3. ビルドエラーが起こらないかの確認は、以下のコマンドで可能です。
   ```bash
   docker compose -f docker-compose.build.yml up --build
   ```

### VS Code（Dev Containers）を使った開発

ホスト（手元）環境の Node.js を汚さず、コンテナ内で直接エディタの補完や型チェックを完全に効かせて開発したい場合は、`.devcontainer/devcontainer.json` による Dev Containers を利用できます。

1. VS Code に拡張機能「Dev Containers」をインストールします。
2. プロジェクトを VS Code で開きます。
3. 画面左下のアイコン（またはコマンドパレット）から `Dev Containers: Reopen in Container` を実行します。
4. 自動的にコンテナがビルドされ、接続と同時に依存関係のインストールや開発サーバーの起動が行われます。

## ツール一覧の仕組み

- **`src/tools.ts`**:

  ツール一覧情報を定義しています。ここを編集するだけで、他に自動反映されます。

- **`src/index-renderer.ts`**:

  `src/tools.ts` をもとに、トップページのツール一覧リンクを動的に生成します。

- **`src/components/hamburger.ts`**:

  `src/tools.ts` をもとに、ハンバーガーメニューのツリー構造を動的に生成します。

- **`src/components/tool-header.ts`**:

  `src/tools.ts` をもとに、各ツールページのヘッダーを動的に生成します。（`data-title` / `data-subtitle` 指定時はそちらを優先）

## Viteのマルチページ自動検出

`vite.config.mts` では `fast-glob` を使用して、リポジトリ内のすべての `index.html`（ルート直下および各サブディレクトリ内）を自動的に検出し、ビルドのエントリーポイント（`rollupOptions.input`）として登録する設定になっています。

新しいツールやサブページを追加する際は、新規ディレクトリを作成してその中に `index.html` を配置するだけで自動的にビルド対象に含まれるため、`vite.config.mts` を手動で書き換える必要はありません。

## `<head>` 要素の一元管理

各ページの `<head>` 要素は、一部を除き各 `index.html` に直書きせず一元管理しています。

- **`src/head-config.ts`**:

  サイト全体の設定と各ページごとのメタ情報を定義しています。

  新しいページを追加した際やメタ情報を変更したい場合は、このファイルを編集します。

- **`src/head-builder.ts`**:

  `vite.config.mts` から呼び出されるカスタム Vite プラグインです。

  開発時・ビルド時に各 `index.html` の `<head>` 内へ、`src/head-config.ts` で定義された内容を自動注入します。

- **`src/common.ts`**:

  全ページ共通リソース・初期化エントリです。

  モジュールは `src/head-config.ts` に文字列で書かず、ここから `import` して Vite にバンドルさせます。

## CI/CD

このリポジトリでは、`.github/workflows/deploy.yml` を用いたGitHub Actionsによる自動デプロイが設定されています。

`main` ブランチへ変更がマージされると、自動的にビルドとGitHub Pagesへのデプロイが実行されます。

ビルド成果物（`dist/` 内のファイル群）は `.gitignore` で除外されており、リポジトリに手動でpushする必要はありません。ローカルやDockerでの確認は、あくまで手元でのテスト用として行います。

## ライセンス

本プロジェクトのライセンスについては `LICENSE` ファイルをご確認ください。

また、本プロジェクトで使用しているWebフォント「Reggae One」には以下のライセンスが適用されています。（詳細は `public/fonts/OFL.txt` を参照）

```markdown
Copyright (c) The Reggae Project Authors
SIL Open Font License, Version 1.1
```
