FROM golang:1.19.5

# # Timezone設定用
# RUN apk --no-cache add tzdata

# ENV TZ=Asia/Tokyo 
# この辺はちょっと適当

# ホストの./backend/をコンテナの/appにコピー
COPY backend/ /app/ 

# ポートを開放
EXPOSE 8080
# カレントディレクトリをセット
WORKDIR /app

RUN go mod download
RUN go mod tidy
RUN go build

# FROM postgres:latest

# # RUN go install github.com/rubenv/sql-migrate/...@latest
# # コンテナログイン時のディレクトリ指定
# WORKDIR /go/src/

# # ホストのファイルをコンテナの作業ディレクトリにコピー
# COPY . .
# # ADD . .



# # CMD ["/opt/sandbox-docker-compose-go/app"]


# RUN localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8
# ENV LANG ja_JP.UTF-

# # 初期化用 sql ファイルを、コンテナ内の所定のディレクトリにコピー
# COPY ./docker/postgres/init/*.sql /docker-entrypoint-initdb.d/
