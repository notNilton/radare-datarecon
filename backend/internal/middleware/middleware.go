package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"radare-datarecon/backend/internal/config"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// HTTPError allows handlers to specify HTTP error codes and messages.
type HTTPError struct {
	Code    int
	Message string
}

func (e HTTPError) Error() string {
	return e.Message
}

// AppHandler is a custom handler type that returns an error.
type AppHandler func(w http.ResponseWriter, r *http.Request) error

// LoggingMiddleware logs request details.
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		log.Printf(
			"Request: Method=%s URL=%s RemoteAddr=%s UserAgent=%s",
			r.Method,
			r.URL.String(),
			r.RemoteAddr,
			r.UserAgent(),
		)

		next.ServeHTTP(w, r)

		log.Printf("Request finished in %s", time.Since(start))
	})
}

// ErrorHandler é um middleware que captura erros e os trata de forma global
func ErrorHandler(handler AppHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf(
					"Recovered from panic: Method=%s URL=%s Error=%v",
					r.Method,
					r.URL.String(),
					err,
				)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()

		if err := handler(w, r); err != nil {
			log.Printf(
				"Request error: Method=%s URL=%s Error=%v",
				r.Method,
				r.URL.String(),
				err,
			)

			// Check if the error is a specific HTTP error. If not, return a generic 500.
			if httpErr, ok := err.(HTTPError); ok {
				http.Error(w, httpErr.Message, httpErr.Code)
			} else {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}
	}
}

// AuthMiddleware é um middleware para verificar o token JWT.
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header é obrigatório", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			http.Error(w, "Formato do token inválido", http.StatusUnauthorized)
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Método de assinatura inesperado: %v", token.Header["alg"])
			}
			return config.JWTSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Token inválido", http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			ctx := context.WithValue(r.Context(), "userID", claims["user_id"])
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			http.Error(w, "Claims do token inválidos", http.StatusUnauthorized)
		}
	})
}
