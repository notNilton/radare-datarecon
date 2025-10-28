// Package handlers contains the HTTP request handlers for the API.
package handlers

import (
	"encoding/json"
	"net/http"
	"radare-datarecon/backend/internal/database"
	"radare-datarecon/backend/internal/middleware"
	"radare-datarecon/backend/internal/models"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// AuthRequest defines the structure for authentication (login) requests.
type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// RegisterRequest defines the structure for a new user registration request.
// It includes all the necessary fields to create a complete user profile.
type RegisterRequest struct {
	Username     string `json:"username"`
	Password     string `json:"password"`
	Name         string `json:"name"`
	ContactEmail string `json:"contact_email"`
	ProfileIcon  string `json:"profile_icon"`
	models.Address
}

// Register creates a new user in the system.
// This function handles the registration request, validates the data, and stores the new user in the database.
func Register(w http.ResponseWriter, r *http.Request) error {
	if r.Method != http.MethodPost {
		return middleware.HTTPError{Code: http.StatusMethodNotAllowed, Message: "Method not allowed"}
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return middleware.HTTPError{Code: http.StatusBadRequest, Message: "Invalid request body: " + err.Error()}
	}

	// Generate a hash of the password for secure storage.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err // Return a 500 error if hashing fails.
	}

	// Create a new User instance with the request data.
	user := models.User{
		Username:     req.Username,
		Password:     string(hashedPassword),
		Name:         req.Name,
		ContactEmail: req.ContactEmail,
		Address:      req.Address,
		ProfileIcon:  req.ProfileIcon,
	}

	// Save the new user to the database.
	if result := database.DB.Create(&user); result.Error != nil {
		return middleware.HTTPError{Code: http.StatusInternalServerError, Message: "Error creating user: " + result.Error.Error()}
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
	return nil
}

// LoginHandler creates a handler for the POST /api/login endpoint.
// It authenticates a user and returns a JWT. This function is a factory
// that injects the JWT secret, decoupling the handler from global configuration.
func LoginHandler(jwtSecret string) middleware.AppHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		if r.Method != http.MethodPost {
			return middleware.HTTPError{Code: http.StatusMethodNotAllowed, Message: "Method not allowed"}
		}

		var req AuthRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			return middleware.HTTPError{Code: http.StatusBadRequest, Message: "Invalid request body: " + err.Error()}
		}

		var user models.User
		if result := database.DB.Where("username = ?", req.Username).First(&user); result.Error != nil {
			return middleware.HTTPError{Code: http.StatusNotFound, Message: "User not found"}
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			return middleware.HTTPError{Code: http.StatusUnauthorized, Message: "Incorrect password"}
		}

		// Create the JWT
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": user.ID,
			"exp":     time.Now().Add(time.Hour * 72).Unix(),
		})

		tokenString, err := token.SignedString([]byte(jwtSecret))
		if err != nil {
			return err
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
		return nil
	}
}

// GetUserProfile returns the profile of the authenticated user.
// The user ID is extracted from the JWT, which is validated by the AuthMiddleware.
func GetUserProfile(w http.ResponseWriter, r *http.Request) error {
	// The user ID is injected into the context by the AuthMiddleware.
	userID, ok := r.Context().Value("userID").(float64)
	if !ok {
		// This error indicates a problem with the middleware or how the token was generated.
		return middleware.HTTPError{Code: http.StatusBadRequest, Message: "Invalid user ID in token"}
	}

	var user models.User
	// Fetch the user from the database, omitting the password for security.
	if result := database.DB.Select("id", "username", "name", "contact_email", "address", "profile_icon").First(&user, uint(userID)); result.Error != nil {
		return middleware.HTTPError{Code: http.StatusNotFound, Message: "User not found"}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
	return nil
}

// UpdateUserProfile updates the profile of the authenticated user.
// Only the fields provided in the request are updated.
func UpdateUserProfile(w http.ResponseWriter, r *http.Request) error {
	userID, ok := r.Context().Value("userID").(float64)
	if !ok {
		return middleware.HTTPError{Code: http.StatusBadRequest, Message: "Invalid user ID in token"}
	}

	var user models.User
	if result := database.DB.First(&user, uint(userID)); result.Error != nil {
		return middleware.HTTPError{Code: http.StatusNotFound, Message: "User not found"}
	}

	// Decode the request into a map to allow for partial updates.
	var updates map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		return middleware.HTTPError{Code: http.StatusBadRequest, Message: "Invalid request body"}
	}

	// GORM allows updating from a map, which is ideal for partial updates.
	// Prevent password from being updated through this endpoint.
	delete(updates, "password")
	if result := database.DB.Model(&user).Updates(updates); result.Error != nil {
		return middleware.HTTPError{Code: http.StatusInternalServerError, Message: "Error updating user profile"}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
	return nil
}

// ChangePasswordRequest defines the structure for a password change request.
type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password"`
}

// ChangePassword changes the password of the authenticated user.
// It requires the current password for verification before setting the new one.
func ChangePassword(w http.ResponseWriter, r *http.Request) error {
	userID, ok := r.Context().Value("userID").(float64)
	if !ok {
		return middleware.HTTPError{Code: http.StatusBadRequest, Message: "Invalid user ID in token"}
	}

	var req ChangePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return middleware.HTTPError{Code: http.StatusBadRequest, Message: "Invalid request body"}
	}

	var user models.User
	if result := database.DB.First(&user, uint(userID)); result.Error != nil {
		return middleware.HTTPError{Code: http.StatusNotFound, Message: "User not found"}
	}

	// Verify that the provided current password matches the stored password.
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		return middleware.HTTPError{Code: http.StatusUnauthorized, Message: "Incorrect current password"}
	}

	// Generate a hash of the new password.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err // Internal server error when generating the hash.
	}

	// Update the user's password in the database.
	if result := database.DB.Model(&user).Update("password", string(hashedPassword)); result.Error != nil {
		return middleware.HTTPError{Code: http.StatusInternalServerError, Message: "Error changing password"}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Password changed successfully"})
	return nil
}