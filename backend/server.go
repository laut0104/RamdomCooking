package main

import (
	// "github.com/gin-gonic/gin"
	"fmt"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/line/line-bot-sdk-go/linebot"
	// "github.com/joho/godotenv"
	// _ "github.com/lib/pq"
	// "github.com/joho/godotenv"
	// "github.com/goark/gocli/config"
	// "github.com/goark/gocli/exitcode"
)

func main() {
	// インスタンスを作成
	e := echo.New()
	// bot, err := linebot.New(
	// 	// os.Getenv("LINE_BOT_CHANNEL_SECRET"),
	// 	// os.Getenv("LINE_BOT_CHANNEL_TOKEN"),
	// 	"28054097ea37d55e61e6d0589e5c869f",
	// 	"e98a/3YltcPyahTpVzVWlqFIc7CiGjhlopb0ibpf83CoGK9nsK5YspJsbMOF3TDxhPfiDEeBeTyHNtJSk7Om3M64rgYB45EQKQGUhHoEJ/OvJ7USvstzsRKPrskxBrEIqdIZrWKX7xksHuNDrPW9hwdB04t89/1O/w1cDnyilFU=",
	// )
	// エラーに値があればログに出力し終了する
	// if err != nil {
	//     log.Fatal(err)
	// }
	// weatherパッケージパッケージから天気情報の文字列を取得する
	// result, err := weather.GetWeather()
	// // エラーに値があればログに出力し終了する
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// http.HandleFunc("/callback", func(w http.ResponseWriter, req *http.Request) {
	//     events, err := bot.ParseRequest(req)
	//     if err != nil {
	//         if err == linebot.ErrInvalidSignature {
	//             w.WriteHeader(400)
	//         } else {
	//             w.WriteHeader(500)
	//         }
	//         return
	//     }
	//     for _, event := range events {
	//         switch event.Type {
	//         case linebot.EventTypeFollow:
	//             message := "友達登録できたよ！ありがとう"
	//             fmt.Printf("%v", event)
	//             if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(message)).Do(); err != nil {
	//                 log.Print(err)
	//             }

	//         case linebot.EventTypeMessage:
	//             switch message := event.Message.(type) {
	//             case *linebot.TextMessage:
	//                 if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(message.Text)).Do(); err != nil {
	//                     log.Print(err)
	//                 }
	//             case *linebot.StickerMessage:
	//                 replyMessage := fmt.Sprintf(
	//                     "sticker id is %s, stickerResourceType is %s", message.StickerID, message.StickerResourceType)
	//                 if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(replyMessage)).Do(); err != nil {
	//                     log.Print(err)
	//                 }
	//             }
	//         }
	//     }
	// })
	// // This is just sample code.
	// // For actual use, you must support HTTPS by using `ListenAndServeTLS`, a reverse proxy or something else.
	// if err := http.ListenAndServe("localhost:8080", nil); err != nil {
	//     log.Fatal(err)
	// }

	// ミドルウェアを設定
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// ルートを設定
	e.GET("/", hello) // ローカル環境の場合、http://localhost:1323/ にGETアクセスされるとhelloハンドラーを実行する
	e.POST("/callback", line)

	// サーバーをポート番号1323で起動
	e.Logger.Fatal(e.Start(":8080"))
}

// ハンドラーを定義
func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}

func line(c echo.Context) error {
	bot, err := linebot.New(
		// 	// os.Getenv("LINE_BOT_CHANNEL_SECRET"),
		// 	// os.Getenv("LINE_BOT_CHANNEL_TOKEN"),
		"28054097ea37d55e61e6d0589e5c869f",
		"e98a/3YltcPyahTpVzVWlqFIc7CiGjhlopb0ibpf83CoGK9nsK5YspJsbMOF3TDxhPfiDEeBeTyHNtJSk7Om3M64rgYB45EQKQGUhHoEJ/OvJ7USvstzsRKPrskxBrEIqdIZrWKX7xksHuNDrPW9hwdB04t89/1O/w1cDnyilFU=",
	)
	// received, err := bot.ParseRequest(c.Request().(*standard.Request).Request)
	// if err != nil {
	//     log.Infof(cx, err.Error())
	//     return c.JSON(http.StatusInternalServerError, err)
	// }
	events, err := bot.ParseRequest(c.Request())
	if err != nil {
		if err == linebot.ErrInvalidSignature {
			c.Response().WriteHeader(400)
			return c.String(400, "Hello, World!")
		} else {
			c.Response().WriteHeader(500)
			return c.String(500, "Hello, World!")
		}
		// return c.String("Hello, World!")
	}
	for _, event := range events {
		fmt.Printf("%v", event.Source)
		switch event.Type {
		case linebot.EventTypeFollow:
			message := "友達登録ありがとう！\nあなたの名前を教えてね！\n※10文字以内"
			fmt.Printf("%v", event)
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
	// This is just sample code.
	// For actual use, you must support HTTPS by using `ListenAndServeTLS`, a reverse proxy or something else.
	// if err := http.ListenAndServe("localhost:8080", nil); err != nil {
	// 	log.Fatal(err)
	// }
	return c.String(http.StatusOK, "Hello, World!")
}
