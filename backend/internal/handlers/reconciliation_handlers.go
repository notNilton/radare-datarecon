// Package handlers contém os manipuladores de requisições HTTP para a API.
package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"radare-datarecon/backend/internal/reconciliation"
	"sync"
	"time"

	"gonum.org/v1/gonum/mat"
)

// CurrentValues representa uma estrutura de dados de exemplo com dois valores inteiros.
// É usado pelo endpoint /api/current-values para demonstrar a atualização de dados em tempo real.
type CurrentValues struct {
	Value1 int `json:"value1"` // O primeiro valor.
	Value2 int `json:"value2"` // O segundo valor.
}

// ReconciliationRequest representa o corpo da requisição para o endpoint de reconciliação.
// Contém todos os dados necessários para realizar o processo de reconciliação.
type ReconciliationRequest struct {
	// Measurements é um slice de float64 representando os valores medidos.
	Measurements []float64 `json:"measurements"`
	// Tolerances é um slice de float64 representando as tolerâncias percentuais para cada medição.
	Tolerances []float64 `json:"tolerances"`
	// Constraints é uma matriz (slice de slices de float64) que representa as equações de restrição linear.
	Constraints [][]float64 `json:"constraints"`
}

// ReconciliationResponse representa a estrutura da resposta JSON para uma reconciliação bem-sucedida.
type ReconciliationResponse struct {
	ReconciledValues  []float64 `json:"reconciled_values"`
	Corrections       []float64 `json:"corrections"`
	ConsistencyStatus string    `json:"consistency_status"`
	// Outros campos como Chi2TestResult, etc., podem ser adicionados aqui.
}

var (
	currentValues CurrentValues
	mutex         sync.RWMutex // Mutex para garantir o acesso seguro e concorrente à variável `currentValues`.
)

// init é uma função especial do Go que é executada na inicialização do pacote.
// Aqui, ela inicia uma goroutine para atualizar os valores de exemplo periodicamente.
func init() {
	go updateValues()
}

// updateValues é uma função executada em uma goroutine que atualiza `currentValues` a cada segundo.
// Ela alterna os valores entre (50, 100) e (100, 50), demonstrando uma fonte de dados dinâmica.
func updateValues() {
	for {
		// Bloqueia o mutex para escrita, garantindo que nenhuma outra goroutine leia ou escreva enquanto os valores são atualizados.
		mutex.Lock()
		if currentValues.Value1 == 50 {
			currentValues.Value1 = 100
			currentValues.Value2 = 50
		} else {
			currentValues.Value1 = 50
			currentValues.Value2 = 100
		}
		mutex.Unlock() // Libera o mutex após a atualização.

		// Pausa a goroutine por 1 segundo antes da próxima atualização.
		time.Sleep(1 * time.Second)
	}
}

// GetCurrentValues é o manipulador para o endpoint GET /api/current-values.
// Ele retorna os valores atuais da estrutura `currentValues` em formato JSON.
// A função retorna um erro para ser tratado pelo middleware ErrorHandler.
func GetCurrentValues(w http.ResponseWriter, r *http.Request) error {
	w.Header().Set("Content-Type", "application/json")

	// Bloqueia o mutex para leitura, permitindo múltiplas leituras concorrentes, mas bloqueando escritas.
	mutex.RLock()
	values := currentValues
	mutex.RUnlock() // Libera o bloqueio de leitura.

	// Codifica a estrutura `values` para JSON e a escreve no corpo da resposta.
	if err := json.NewEncoder(w).Encode(values); err != nil {
		// Se a codificação falhar, o erro é retornado para ser tratado pelo middleware.
		return err
	}
	return nil
}

// ReconcileData é o manipulador para o endpoint POST /api/reconcile.
// Ele processa a requisição de reconciliação de dados.
func ReconcileData(w http.ResponseWriter, r *http.Request) error {
	// Garante que o método da requisição seja POST.
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return nil // Retorna nil porque a resposta de erro já foi escrita.
	}

	// Decodifica o corpo da requisição JSON para a estrutura ReconciliationRequest.
	var req ReconciliationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, fmt.Sprintf("Corpo da requisição inválido: %v", err), http.StatusBadRequest)
		return nil
	}

	// Converte a matriz de restrições de [][]float64 para o tipo *mat.Dense esperado pela biblioteca gonum.
	rows := len(req.Constraints)
	if rows == 0 {
		http.Error(w, "Erro de validação: A matriz 'constraints' não pode estar vazia.", http.StatusBadRequest)
		return nil
	}
	cols := len(req.Constraints[0])
	if cols != len(req.Measurements) {
		http.Error(w, fmt.Sprintf("Erro de validação: O número de colunas nas restrições (%d) deve ser igual ao número de medições (%d).", cols, len(req.Measurements)), http.StatusBadRequest)
		return nil
	}

	constraints := mat.NewDense(rows, cols, nil)
	for i, row := range req.Constraints {
		if len(row) != cols {
			http.Error(w, fmt.Sprintf("Erro de validação: A linha %d da matriz de restrições tem %d elementos, mas o esperado era %d.", i, len(row), cols), http.StatusBadRequest)
			return nil
		}
		constraints.SetRow(i, row)
	}

	// Chama a função de reconciliação principal com os dados da requisição.
	reconciledValues, err := reconciliation.Reconcile(req.Measurements, req.Tolerances, constraints)
	if err != nil {
		// Se a reconciliação falhar, retorna um erro com o status apropriado.
		// Erros de validação dentro de Reconcile() devem idealmente retornar um erro específico.
		// Por enquanto, tratamos a maioria como Bad Request, exceto por inversão de matriz que é mais sistêmico.
		http.Error(w, fmt.Sprintf("Erro ao processar a reconciliação: %v", err), http.StatusBadRequest)
		return nil
	}

	// Calcula as correções aplicadas.
	corrections := make([]float64, len(req.Measurements))
	for i := range req.Measurements {
		corrections[i] = reconciledValues[i] - req.Measurements[i]
	}

	// Prepara e envia a resposta de sucesso em formato JSON.
	w.Header().Set("Content-Type", "application/json")
	response := ReconciliationResponse{
		ReconciledValues:  reconciledValues,
		Corrections:       corrections,
		ConsistencyStatus: "Consistente", // Este é um valor placeholder. Um teste real (ex: Qui-quadrado) seria implementado aqui.
	}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		// Se a codificação da resposta falhar, o erro é retornado para o middleware.
		return err
	}

	return nil
}
