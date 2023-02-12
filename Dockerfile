FROM golang:1.19.5

WORKDIR /opt/app

# COPY go.mod ./
# COPY go.sum ./
# RUN go mod download

# COPY *.go ./

# RUN go build -o /randomcooking

EXPOSE 8080

# CMD ["/randomcooking"]
