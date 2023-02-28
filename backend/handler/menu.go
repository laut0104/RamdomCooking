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
		return err
	}
	menu := new(Menu)
	err = db.QueryRow(`SELECT * FROM menus where id=$1 and userid=$2 `, id, uid).Scan(&menu.Id, &menu.Userid, &menu.Menuname, &menu.Recipes)
	if err != nil {
		fmt.Println(err)
		return err
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
		return err
	}

	rows, err := db.Query(`SELECT * FROM menus where userid=$1 `, uid)
	if err != nil {
		fmt.Println(err)
		return err
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
	menu := new(Menu)
	if err := c.Bind(menu); err != nil {
		return err
	}
	connStr := "user=root dbname=randomcooking password=password host=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println(err)
		return err
	}
	_, err = db.Exec(`INSERT INTO menus (userid, menuname, recipes) VALUES($1, $2, $3)`, menu.Userid, menu.Menuname, menu.Recipes)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer db.Close()
	return c.JSON(http.StatusOK, menu)
}

func UpdateMenu(c echo.Context) error {
	menu := new(Menu)
	if err := c.Bind(menu); err != nil {
		return err
	}
	connStr := "user=root dbname=randomcooking password=password host=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println(err)
		return err
	}
	_, err = db.Exec(`UPDATE menus SET(menuname, recipes)=($1, $2) WHERE id=$3 AND userid=$4`, menu.Menuname, menu.Recipes, menu.Id, menu.Userid)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer db.Close()
	return c.JSON(http.StatusOK, menu)
}
