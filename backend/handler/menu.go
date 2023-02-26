package handler

import (
	"database/sql"

	_ "github.com/lib/pq"

	"fmt"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Menu struct {
	Id       int    `json:"id" param:"id"`
	Userid   int    `json:"userid" param:"uid"`
	Menuname string `json:"menuname" param:"menuname"`
	Recipes  string `json:"recipes" param:"recipes"`
}

type Menus struct {
	Menus []Menu `json:"menus"`
}

func GetMenu(c echo.Context) error {
	uid := c.Param("uid")
	id := c.Param("id")
	connStr := "user=root dbname=randomcooking password=password host=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println(err)
		return nil
	}
	menu := new(Menu)
	err = db.QueryRow(`SELECT * FROM menus where id=$1 and userid=$2 `, id, uid).Scan(&menu.Id, &menu.Userid, &menu.Menuname, &menu.Recipes)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	fmt.Println(menu)
	defer db.Close()
	return c.JSON(http.StatusOK, menu)
}

func GetMenus(c echo.Context) error {
	uid := c.Param("uid")
	connStr := "user=root dbname=randomcooking password=password host=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println(err)
		return nil
	}

	rows, err := db.Query(`SELECT * FROM menus where userid=$1 `, uid)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer rows.Close()
	menus := Menus{}
	menu := new(Menu)

	for rows.Next() {
		err := rows.Scan(&menu.Id, &menu.Userid, &menu.Menuname, &menu.Recipes)
		if err != nil {
			fmt.Println(err)
			return err
		}
		menus.Menus = append(menus.Menus, *menu)
	}
	fmt.Println(menus)
	defer db.Close()
	return c.JSON(http.StatusOK, menus)
}

func AddMenu(c echo.Context) error {
	// uid := c.Param("uid")
	menu := new(Menu)
	// menu := &Menu{}
	fmt.Println(c)
	if err := c.Bind(menu); err != nil {
		return err
	}
	fmt.Println(menu)
	connStr := "user=root dbname=randomcooking password=password host=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println(err)
		return nil
	}
	_, err = db.Exec(`INSERT INTO menus (userid, menuname, recipes) VALUES($1, $2, $3)`, menu.Userid, menu.Menuname, menu.Recipes)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	fmt.Println(menu)
	defer db.Close()
	return c.JSON(http.StatusOK, menu)
}
