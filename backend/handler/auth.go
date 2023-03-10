package handler

import (
	_ "github.com/lib/pq"

	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JwtClaims struct {
	Name   string `json:"name"`
	UserId string `json:"uid"`
	jwt.RegisteredClaims
}

func Getjwt(name, uid string) string {
	mySigningKey := []byte("RandomCookingByYano")
	claims := JwtClaims{
		name,
		uid,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 1)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(mySigningKey)
	fmt.Println(ss)
	if err != nil {
		fmt.Println(err)
		// return err
	}
	return ss
}
