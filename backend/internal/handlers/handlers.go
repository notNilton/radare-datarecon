// Package handlers contém os manipuladores de requisições HTTP para a API.
package handlers

import (
	"encoding/json"
	"net/http"
	"radare-datarecon/backend/internal/reconciliation"
	"sync"
	"time"

	"radare-datarecon/backend/internal/config"
	"radare-datarecon/backend/internal/database"
	"radare-datarecon/backend/internal/models"
	"gonum.org/v1/gonum/mat"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// AuthRequest define a estrutura para requisições de autenticação (login/registro).
type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}


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

// Register é o manipulador para o endpoint POST /api/register.
// Ele cria um novo usuário no banco de dados.
func Register(w http.ResponseWriter, r *http.Request) error {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return nil
	}

	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Corpo da requisição inválido: "+err.Error(), http.StatusBadRequest)
		return nil
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := models.User{Username: req.Username, Password: string(hashedPassword)}
	if result := database.DB.Create(&user); result.Error != nil {
		http.Error(w, "Erro ao criar usuário: "+result.Error.Error(), http.StatusInternalServerError)
		return nil
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Usuário criado com sucesso"})
	return nil
}

// Login é o manipulador para o endpoint POST /api/login.
// Ele autentica um usuário e retorna um token JWT.
func Login(w http.ResponseWriter, r *http.Request) error {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return nil
	}

	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Corpo da requisição inválido: "+err.Error(), http.StatusBadRequest)
		return nil
	}

	var user models.User
	if result := database.DB.Where("username = ?", req.Username).First(&user); result.Error != nil {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return nil
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		http.Error(w, "Senha incorreta", http.StatusUnauthorized)
		return nil
	}

	// Cria o token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString(config.JWTSecret)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
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
		http.Error(w, "Corpo da requisição inválido: "+err.Error(), http.StatusBadRequest)
		return nil
	}

	// Converte a matriz de restrições de [][]float64 para o tipo *mat.Dense esperado pela biblioteca gonum.
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

	// Chama a função de reconciliação principal com os dados da requisição.
	reconciledData, err := reconciliation.Reconcile(req.Measurements, req.Tolerances, constraints)
	if err != nil {
		// Se a reconciliação falhar, retorna um erro de servidor interno.
		http.Error(w, "Erro ao reconciliar os dados: "+err.Error(), http.StatusInternalServerError)
		return nil
	}

	// Prepara e envia a resposta de sucesso em formato JSON.
	w.Header().Set("Content-Type", "application/json")
	response := map[string][]float64{"reconciled": reconciledData}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		// Se a codificação da resposta falhar, o erro é retornado para o middleware.
		return err
	}

	return nil
}

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
