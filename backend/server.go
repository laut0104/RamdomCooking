package main

import (
	"database/sql"
	"encoding/json"
	"io"
	"strings"

	_ "github.com/lib/pq"

	"fmt"
	"log"
	"net/http"
	"net/url"

	"github.com/laut0104/RandomCooking/handler"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/line/line-bot-sdk-go/v7/linebot"
)

type Foo struct {
	Token string `json:"access_token"`
	Type  string `json:"token_type"`
	Exp   int64  `json:"expires_in"`
	Id    string `json:"key_id"`
}
type LineAuthResponse struct {
	Iss     string   `json:"iss"`
	Sub     string   `json:"sub"`
	Aud     string   `json:"aud"`
	Exp     int64    `json:"exp,string"`
	Iat     int64    `json:"iat,string"`
	Nonce   string   `json:"nonce"`
	Amr     []string `json:"amr"`
	Name    string   `json:"name"`
	Picture string   `json:"picture"`
}

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
	e.DELETE("/menu/:uid/:id", handler.DeleteMenu)
	e.POST("/callback", line)
	// e.GET("/api/auth/line/callback", login)
	e.GET("/auth/line/callback", login)

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

func login(c echo.Context) error {
	code := c.QueryParam("access_token")
	values := url.Values{}
	values.Set("client_id", "1660690567")
	values.Add("id_token", code)
	req, err := http.NewRequest(
		"POST",
		"https://api.line.me/oauth2/v2.1/verify",
		strings.NewReader(values.Encode()),
	)
	if err != nil {
		fmt.Println(err)
		return err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer resp.Body.Close()

	byteArray, err := io.ReadAll(resp.Body)
	post := new(LineAuthResponse)
	// decoder := json.NewDecoder(resp.Body)
	if err != nil {
		fmt.Println("Error")
	}
	err = json.Unmarshal(byteArray, &post)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(post.Name, post.Sub)

	// res, err := http.Post("https://api.line.me/oauth2/v2.1/verify", contentType, body)
	// // url := c.QueryParam("liffRedirectUri")
	// fmt.Println(code)
	// // getjwt(code, url)
	return c.JSON(200, "LoginOK")
}

func getjwt(token, uri string) error {
	fmt.Println(token)
	form := url.Values{}
	form.Set("grant_type", "authorization_code")
	form.Set("client_id", "1660690567")
	form.Set("client_secret", "cf7128f88d71b8e25d530bf33a4e6d9f")
	form.Set("code", token)
	form.Set("redirect_uri", uri)
	fmt.Println(form)
	body := strings.NewReader(form.Encode()) // リクエストのbodyを作成
	req, err := http.NewRequest(http.MethodPost, "https://api.line.me/oauth2/v2.1/token", body)
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// 作成したリクエストの送信
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(res)
	defer res.Body.Close()

	// レスポンスの解析
	var r io.Reader = res.Body

	var foo Foo
	err = json.NewDecoder(r).Decode(&foo)
	if err != nil {
		log.Fatal(err)
	}

	bytes, err := json.Marshal(foo)

	fmt.Println("🎁チャネルアクセストークンを含むペイロード")
	fmt.Println(string(bytes))

	fmt.Println("🔑チャネルアクセストークン")
	fmt.Println(foo.Token)
	return nil
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
