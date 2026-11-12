FROM node:20-alpine

WORKDIR /app

# package.json や package-lock.json をコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードをコピー
COPY . .

# ビルド実行
RUN npm run build