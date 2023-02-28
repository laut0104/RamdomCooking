package main

import (
	"database/sql"

	_ "github.com/lib/pq"

	"fmt"
	"log"
	"net/http"

	"github.com/laut0104/RandomCooking/handler"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/line/line-bot-sdk-go/v7/linebot"
)

func main() {
	// インスタンスを作成
	e := echo.New()

	// ミドルウェアを設定
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Use(middleware.CORS())

	// ルートを設定
	e.GET("/", hello)
	e.GET("/user/:id", handler.GetUser)
	e.GET("/menu/:uid/:id", handler.GetMenu)
	e.GET("/menus/:uid", handler.GetMenus)
	e.POST("/menu/:uid", handler.AddMenu)
	e.PUT("/menu/:uid/:id", handler.UpdateMenu)
	e.POST("/callback", line)

	// サーバーをポート番号8080で起動
	e.Logger.Fatal(e.Start(":8080"))
}

// ハンドラーを定義
func hello(c echo.Context) error {
	connStr := "user=root dbname=randomcooking password=password host=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println(err)
		return nil
	}
	/*データベースに登録されていない場合*/
	rows, err := db.Query(`SELECT * FROM menus`)
	if err != nil {
		// log.Println(err)
		fmt.Println(err)
		return nil
	}
	for rows.Next() {
		var id string
		var userid int
		var menuname string
		var recipes string
		err := rows.Scan(&id, &userid, &menuname, &recipes)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(userid, menuname, recipes, rows)
	}

	defer db.Close()

	// return exitcode.Normal

	return c.String(http.StatusOK, "Hello, World!")

}

func line(c echo.Context) error {
	bot, err := linebot.New(
		// 	// os.Getenv("LINE_BOT_CHANNEL_SECRET"),
		// 	// os.Getenv("LINE_BOT_CHANNEL_TOKEN"),
		"28054097ea37d55e61e6d0589e5c869f",
		"e98a/3YltcPyahTpVzVWlqFIc7CiGjhlopb0ibpf83CoGK9nsK5YspJsbMOF3TDxhPfiDEeBeTyHNtJSk7Om3M64rgYB45EQKQGUhHoEJ/OvJ7USvstzsRKPrskxBrEIqdIZrWKX7xksHuNDrPW9hwdB04t89/1O/w1cDnyilFU=",
	)
	events, err := bot.ParseRequest(c.Request())
	if err != nil {
		if err == linebot.ErrInvalidSignature {
			c.Response().WriteHeader(400)
			return c.String(400, "Hello, World!")
		} else {
			c.Response().WriteHeader(500)
			return c.String(500, "Hello, World!")
		}
	}
	for _, event := range events {
		switch event.Type {
		case linebot.EventTypeFollow:
			message := "友達登録ありがとう！\nあなたの名前を教えてね！\n※10文字以内"
			fmt.Printf("%v", event)
			if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(message)).Do(); err != nil {
				log.Print(err)
				errmsg := "正常にユーザー登録できませんでした\nブロックし、もう一度友達登録をお願いします"
				if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(errmsg)).Do(); err != nil {
					log.Print(err)
				}
			}

		case linebot.EventTypeMessage:
			switch message := event.Message.(type) {
			case *linebot.TextMessage:
				// データベースの接続
				connStr := "user=root dbname=randomcooking password=password host=postgres sslmode=disable"
				db, err := sql.Open("postgres", connStr)
				if err != nil {
					log.Println(err)
					return nil
				}

				rows, err := db.Query(`SELECT * FROM users where lineuserId=$1`, event.Source.UserID)
				if err != nil {
					fmt.Println(err)
				}
				defer rows.Close()

				/*データベースに登録されていない場合*/
				if !rows.Next() {
					_, err := db.Exec(`INSERT INTO users (lineuserid, username) VALUES($1, $2)`, event.Source.UserID, message.Text)
					if err != nil {
						log.Println(err)
						return nil
					}
				} else {
					var id int
					var lineuserid string
					var username string
					rows.Scan(&id, &lineuserid, &username)
					/*メニューの登録*/
					_, err := db.Exec(`INSERT INTO menus (userid, menuname, recipes) VALUES($1, $2, '{"テスト/", "メニューです/"}')`, id, message.Text)
					if err != nil {
						log.Println(err)
						return nil
					}
				}

				defer db.Close()

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
	return c.String(http.StatusOK, "Hello, World!")
}
