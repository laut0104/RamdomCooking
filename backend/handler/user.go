package handler

import (
	"database/sql"

	_ "github.com/lib/pq"

	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type User struct {
	Id         int    `json:"id"`
	Lineuserid string `json:"lineuserid"`
	Username   string `json:"username"`
}

func GetUserById(c echo.Context) error {
	id := c.Param("id")
	connStr := "user=root dbname=randomcooking password=password host=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println(err)
		return err
	}
	u := new(User)
	err = db.QueryRow(`SELECT * FROM users where id=$1`, id).Scan(&u.Id, &u.Lineuserid, &u.Username)

	defer db.Close()
	return c.JSON(http.StatusOK, u)

}

func GetUser(c echo.Context) error {
	lineid := c.QueryParam("lineuserid")
	connStr := "user=root dbname=randomcooking password=password host=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println(err)
		return err
	}
	u := new(User)
	err = db.QueryRow(`SELECT * FROM users where lineuserid=$1`, lineid).Scan(&u.Id, &u.Lineuserid, &u.Username)

	defer db.Close()
	return c.JSON(http.StatusOK, u)

}
