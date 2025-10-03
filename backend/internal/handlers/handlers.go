// handlers.go
package handlers

import (
	"encoding/json"
	"net/http"
	"radare-datarecon/backend/internal/reconciliation"
	"sync"
	"time"

	"gonum.org/v1/gonum/mat"
	// Import the middleware package (not needed here, but might be in other handlers)
)

// Estrutura para representar os valores
type CurrentValues struct {
	Value1 int `json:"value1"`
	Value2 int `json:"value2"`
}

// ReconciliationRequest representa o corpo da requisição para o endpoint de reconciliação.
type ReconciliationRequest struct {
	Measurements []float64   `json:"measurements"`
	Tolerances   []float64   `json:"tolerances"`
	Constraints  [][]float64 `json:"constraints"`
}

var (
	currentValues CurrentValues
	mutex         sync.RWMutex // Mutex para garantir acesso seguro aos valores
)

// Inicializa a variação dos valores
func init() {
	go updateValues()
}

// updateValues atualiza os valores a cada segundo
func updateValues() {
	for {
		// Bloqueia o mutex para escrita
		mutex.Lock()
		// Alterna os valores entre 50 e 100
		if currentValues.Value1 == 50 {
			currentValues.Value1 = 100
			currentValues.Value2 = 50
		} else {
			currentValues.Value1 = 50
			currentValues.Value2 = 100
		}
		// Libera o mutex
		mutex.Unlock()

		// Aguarda 1 segundo antes de atualizar novamente
		time.Sleep(1 * time.Second)
	}
}

// GetCurrentValues retorna os valores atuais
func GetCurrentValues(w http.ResponseWriter, r *http.Request) error { // Retorna um erro
	// Configura o cabeçalho para indicar que a resposta é JSON
	w.Header().Set("Content-Type", "application/json")

	// Bloqueia o mutex para leitura
	mutex.RLock()
	values := currentValues
	mutex.RUnlock()

	// Converte a estrutura para JSON e envia como resposta
	if err := json.NewEncoder(w).Encode(values); err != nil {
		return err // Retorna o erro para o middleware
	}
	return nil
}

// ReconcileData processa a requisição de reconciliação de dados.
func ReconcileData(w http.ResponseWriter, r *http.Request) error {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return nil
	}

	var req ReconciliationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Corpo da requisição inválido: "+err.Error(), http.StatusBadRequest)
		return nil
	}

	// Converte a matriz de restrições de [][]float64 para *mat.Dense
	rows := len(req.Constraints)
	if rows == 0 {
		http.Error(w, "A matriz de restrições não pode estar vazia", http.StatusBadRequest)
		return nil
	}
	cols := len(req.Constraints[0])
	constraints := mat.NewDense(rows, cols, nil)
	for i, row := range req.Constraints {
		if len(row) != cols {
			http.Error(w, "Todas as linhas da matriz de restrições devem ter o mesmo comprimento", http.StatusBadRequest)
			return nil
		}
		constraints.SetRow(i, row)
	}

	// Chama a função de reconciliação
	reconciledData, err := reconciliation.Reconcile(req.Measurements, req.Tolerances, constraints)
	if err != nil {
		http.Error(w, "Erro ao reconciliar os dados: "+err.Error(), http.StatusInternalServerError)
		return nil
	}

	// Envia a resposta
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(map[string][]float64{"reconciled": reconciledData}); err != nil {
		// Se a codificação do JSON falhar, o middleware de erro tratará disso
		return err
	}

	return nil
}

// HealthCheck retorna o status do servidor
func HealthCheck(w http.ResponseWriter, r *http.Request) error { // Retorna um erro
	// Você pode adicionar lógica aqui para verificar a saúde do seu servidor

	// Por enquanto, vamos apenas retornar um status 200 OK
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(map[string]string{"status": "ok"}); err != nil {
		return err
	}
	return nil
}
