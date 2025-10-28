package handlers

import (
	"encoding/json"
	"net/http"
)

// HealthCheck é o manipulador para o endpoint GET /healthz.
// Ele fornece uma verificação de saúde básica para o serviço.
func HealthCheck(w http.ResponseWriter, r *http.Request) error {
	// Define o cabeçalho de status como 200 OK.
	w.WriteHeader(http.StatusOK)
	// Retorna uma resposta JSON simples indicando que o serviço está "ok".
	response := map[string]string{"status": "ok"}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		return err
	}
	return nil
}
