// main.go
package main

import (
	"log"
	"net/http"
	"os"
	"radare/backend-new/handlers"
	"radare/backend-new/middleware"
)

func main() {
	// Define os manipuladores para as rotas, usando o middleware para tratamento de erros
	http.HandleFunc("/api/current-values", middleware.ErrorHandler(handlers.GetCurrentValues))
	http.HandleFunc("/healthz", middleware.ErrorHandler(handlers.HealthCheck))

	// Obtém a porta da variável de ambiente PORT ou usa 8080 como padrão
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Inicia o servidor na porta definida
	log.Println("Servidor iniciado na porta " + port + "...")
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Erro ao iniciar o servidor: %v", err)
	}
}
