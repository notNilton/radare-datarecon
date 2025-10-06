// main.go é o ponto de entrada para o servidor backend.
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"radare-datarecon/backend/internal/database"
	"radare-datarecon/backend/internal/handlers"
	"radare-datarecon/backend/internal/middleware"
	"radare-datarecon/backend/internal/models"
)

func main() {
	// Conecta ao banco de dados e migra o schema.
	database.Connect()
	database.DB.AutoMigrate(&models.User{})

	// Registra os manipuladores para os endpoints da API.
	// Cada manipulador é encapsulado com middlewares para logging e tratamento de erros.
	// Os middlewares são aplicados de forma aninhada: as requisições passam primeiro pelo LoggingMiddleware e depois pelo ErrorHandler.
	http.Handle("/api/register", middleware.LoggingMiddleware(middleware.ErrorHandler(handlers.Register)))
	http.Handle("/api/login", middleware.LoggingMiddleware(middleware.ErrorHandler(handlers.Login)))
	http.Handle("/api/current-values", middleware.LoggingMiddleware(middleware.ErrorHandler(handlers.GetCurrentValues)))
	http.Handle("/api/reconcile", middleware.LoggingMiddleware(middleware.AuthMiddleware(middleware.ErrorHandler(handlers.ReconcileData))))
	http.Handle("/healthz", middleware.LoggingMiddleware(middleware.ErrorHandler(handlers.HealthCheck)))

	// Obtém a porta da variável de ambiente PORT ou usa "8080" como padrão.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Cria e configura o servidor HTTP.
	server := &http.Server{
		Addr:    ":" + port,
		Handler: http.DefaultServeMux, // Usa o multiplexador de serviço padrão, onde os manipuladores foram registrados.
		// É uma boa prática definir timeouts para evitar o esgotamento de recursos.
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Cria um canal para escutar sinais do sistema operacional (SIGINT, SIGTERM) para um desligamento gracioso (graceful shutdown).
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Inicia o servidor em uma goroutine separada para não bloquear a thread principal.
	go func() {
		log.Println("Servidor iniciado na porta " + port + "...")
		// ListenAndServe bloqueia até que o servidor seja desligado ou ocorra um erro.
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Erro ao iniciar o servidor: %v\n", err)
		}
	}()

	// Bloqueia a thread principal até que um sinal de desligamento seja recebido.
	sig := <-sigChan
	log.Printf("Sinal de desligamento recebido: %v, iniciando graceful shutdown...\n", sig)

	// Cria um contexto com um timeout para permitir o desligamento gracioso.
	// Isso dá tempo para as conexões ativas terminarem antes que o servidor seja fechado.
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Tenta desligar o servidor graciosamente.
	// Isso interromperá a aceitação de novas conexões e aguardará a conclusão das existentes.
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("Erro durante o shutdown do servidor: %v\n", err)
	}

	log.Println("Servidor desligado com sucesso.")
}
