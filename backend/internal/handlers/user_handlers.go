// Package handlers contém os manipuladores de requisições HTTP para a API.
package handlers

import (
	"encoding/json"
	"net/http"
	"radare-datarecon/backend/internal/config"
	"radare-datarecon/backend/internal/database"
	"radare-datarecon/backend/internal/models"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// AuthRequest define a estrutura para requisições de autenticação (login).
type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// RegisterRequest define a estrutura para a requisição de registro de um novo usuário.
// Inclui todos os campos necessários para criar um perfil de usuário completo.
type RegisterRequest struct {
	Username     string `json:"username"`
	Password     string `json:"password"`
	Name         string `json:"name"`
	ContactEmail string `json:"contact_email"`
	ProfileIcon  string `json:"profile_icon"`
	models.Address
}

// Register cria um novo usuário no sistema.
// Esta função lida com a requisição de registro, valida os dados e armazena o novo usuário no banco de dados.
func Register(w http.ResponseWriter, r *http.Request) error {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return nil
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Corpo da requisição inválido: "+err.Error(), http.StatusBadRequest)
		return nil
	}

	// Gera o hash da senha para armazenamento seguro.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err // Retorna erro 500 se o hash falhar.
	}

	// Cria uma nova instância de User com os dados da requisição.
	user := models.User{
		Username:     req.Username,
		Password:     string(hashedPassword),
		Name:         req.Name,
		ContactEmail: req.ContactEmail,
		Address:      req.Address,
		ProfileIcon:  req.ProfileIcon,
	}

	// Salva o novo usuário no banco de dados.
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

// GetUserProfile retorna o perfil do usuário autenticado.
// O ID do usuário é extraído do token JWT, que é validado pelo AuthMiddleware.
func GetUserProfile(w http.ResponseWriter, r *http.Request) error {
	// O ID do usuário é injetado no contexto pela AuthMiddleware.
	userID, ok := r.Context().Value("userID").(float64)
	if !ok {
		// Este erro indica um problema com o middleware ou com a forma como o token foi gerado.
		http.Error(w, "ID de usuário inválido no token", http.StatusBadRequest)
		return nil
	}

	var user models.User
	// Busca o usuário no banco de dados, omitindo a senha por segurança.
	if result := database.DB.Select("id", "username", "name", "contact_email", "address", "profile_icon").First(&user, uint(userID)); result.Error != nil {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return nil
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
	return nil
}

// UpdateUserProfile atualiza o perfil do usuário autenticado.
// Apenas os campos fornecidos na requisição são atualizados.
func UpdateUserProfile(w http.ResponseWriter, r *http.Request) error {
	userID, ok := r.Context().Value("userID").(float64)
	if !ok {
		http.Error(w, "ID de usuário inválido no token", http.StatusBadRequest)
		return nil
	}

	var user models.User
	if result := database.DB.First(&user, uint(userID)); result.Error != nil {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return nil
	}

	// Decodifica a requisição em um mapa para permitir atualizações parciais.
	var updates map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, "Corpo da requisição inválido", http.StatusBadRequest)
		return nil
	}

	// O GORM permite a atualização a partir de um mapa, o que é ideal para updates parciais.
	if result := database.DB.Model(&user).Updates(updates); result.Error != nil {
		http.Error(w, "Erro ao atualizar o perfil do usuário", http.StatusInternalServerError)
		return nil
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
	return nil
}

// ChangePasswordRequest define a estrutura para a requisição de mudança de senha.
type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password"`
}

// ChangePassword altera a senha do usuário autenticado.
// Requer a senha atual para verificação antes de definir a nova senha.
func ChangePassword(w http.ResponseWriter, r *http.Request) error {
	userID, ok := r.Context().Value("userID").(float64)
	if !ok {
		http.Error(w, "ID de usuário inválido no token", http.StatusBadRequest)
		return nil
	}

	var req ChangePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Corpo da requisição inválido", http.StatusBadRequest)
		return nil
	}

	var user models.User
	if result := database.DB.First(&user, uint(userID)); result.Error != nil {
		http.Error(w, "Usuário não encontrado", http.StatusNotFound)
		return nil
	}

	// Verifica se a senha atual fornecida corresponde à senha armazenada.
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		http.Error(w, "Senha atual incorreta", http.StatusUnauthorized)
		return nil
	}

	// Gera o hash da nova senha.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err // Erro interno do servidor ao gerar o hash.
	}

	// Atualiza a senha do usuário no banco de dados.
	if result := database.DB.Model(&user).Update("password", string(hashedPassword)); result.Error != nil {
		http.Error(w, "Erro ao alterar a senha", http.StatusInternalServerError)
		return nil
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Senha alterada com sucesso"})
	return nil
}