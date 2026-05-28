FROM golang:1.26-alpine AS builder
RUN go install golang.org/x/tools/cmd/present@latest

FROM alpine:3.20
RUN apk add --no-cache ca-certificates
COPY --from=builder /go/bin/present /usr/local/bin/present
WORKDIR /app
COPY aws-k8s-sharing.slide ./
COPY assets ./assets
EXPOSE 8080
CMD ["present", "-http=0.0.0.0:8080", "-content=/app", "-notes"]
