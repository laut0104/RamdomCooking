package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/line/line-bot-sdk-go/linebot"
)

func main() {
	// LINE Botクライアント生成する
	// BOT にはチャネルシークレットとチャネルトークンを環境変数から読み込み引数に渡す
	bot, err := linebot.New(
		// os.Getenv("LINE_BOT_CHANNEL_SECRET"),
		// os.Getenv("LINE_BOT_CHANNEL_TOKEN"),
		"28054097ea37d55e61e6d0589e5c869f",
		"e98a/3YltcPyahTpVzVWlqFIc7CiGjhlopb0ibpf83CoGK9nsK5YspJsbMOF3TDxhPfiDEeBeTyHNtJSk7Om3M64rgYB45EQKQGUhHoEJ/OvJ7USvstzsRKPrskxBrEIqdIZrWKX7xksHuNDrPW9hwdB04t89/1O/w1cDnyilFU=",
	)
	// エラーに値があればログに出力し終了する
	if err != nil {
		log.Fatal(err)
	}
	// weatherパッケージパッケージから天気情報の文字列を取得する
	// result, err := weather.GetWeather()
	// // エラーに値があればログに出力し終了する
	// if err != nil {
	// 	log.Fatal(err)
	// }
	http.HandleFunc("/callback", func(w http.ResponseWriter, req *http.Request) {
		events, err := bot.ParseRequest(req)
		if err != nil {
			if err == linebot.ErrInvalidSignature {
				w.WriteHeader(400)
			} else {
				w.WriteHeader(500)
			}
			return
		}
		for _, event := range events {
			switch event.Type {
			case linebot.EventTypeFollow:
				message := "友達登録できたよ！ありがとう"
				if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(message)).Do(); err != nil {
					log.Print(err)
				}

			case linebot.EventTypeMessage:
				switch message := event.Message.(type) {
				case *linebot.TextMessage:
					if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(message.Text)).Do(); err != nil {
						log.Print(err)
					}
				case *linebot.StickerMessage:
					replyMessage := fmt.Sprintf(
						"sticker id is %s, stickerResourceType is %s", message.StickerID, message.StickerResourceType)
					if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(replyMessage)).Do(); err != nil {
						log.Print(err)
					}
				}
			}
		}
	})
	// This is just sample code.
	// For actual use, you must support HTTPS by using `ListenAndServeTLS`, a reverse proxy or something else.
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
