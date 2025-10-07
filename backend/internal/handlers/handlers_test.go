package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"radare-datarecon/backend/internal/database"
	"radare-datarecon/backend/internal/middleware"
	"radare-datarecon/backend/internal/models"
	"testing"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const testJWTSecret = "test_secret_key_for_unit_tests"

func setupTestDB() {
	var err error
	// Use an in-memory SQLite database for testing.
	// "cache=shared" is necessary to share the connection across different parts of the test.
	database.DB, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to the test database: " + err.Error())
	}
	// Run migrations to ensure the schema is up-to-date.
	if err := database.DB.AutoMigrate(&models.User{}); err != nil {
		panic("Failed to migrate test database schema: " + err.Error())
	}
}

func TestRegister(t *testing.T) {
	setupTestDB()

	// Case 1: Test a successful user registration.
	regReq := RegisterRequest{
		Username:     "testuser",
		Password:     "password",
		Name:         "Test User",
		ContactEmail: "test@example.com",
	}
	body, _ := json.Marshal(regReq)
	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	rr := httptest.NewRecorder()
	handler := middleware.ErrorHandler(Register)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusCreated)
	}

	// Case 2: Test a duplicate registration to ensure it fails.
	req, _ = http.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusInternalServerError {
		t.Errorf("handler returned wrong status code for duplicate registration: got %v want %v", status, http.StatusInternalServerError)
	}
}

func TestLogin(t *testing.T) {
	setupTestDB()

	// First, register a user to have a valid login target.
	regReq := RegisterRequest{Username: "testuser", Password: "password"}
	body, _ := json.Marshal(regReq)
	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	middleware.ErrorHandler(Register).ServeHTTP(httptest.NewRecorder(), req)

	// Instantiate the login handler with the test secret.
	loginHandler := middleware.ErrorHandler(LoginHandler(testJWTSecret))
	authReq := AuthRequest{Username: "testuser", Password: "password"}
	body, _ = json.Marshal(authReq)

	// Case 1: Test a successful login.
	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(body))
	rr := httptest.NewRecorder()
	loginHandler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code for successful login: got %v want %v", status, http.StatusOK)
	}

	var resp map[string]string
	json.Unmarshal(rr.Body.Bytes(), &resp)
	if resp["token"] == "" {
		t.Errorf("handler should return a token on successful login, but it was empty")
	}

	// Case 2: Test login with an incorrect password.
	authReq.Password = "wrongpassword"
	body, _ = json.Marshal(authReq)
	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(body))
	rr = httptest.NewRecorder()
	loginHandler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code for wrong password: got %v want %v", status, http.StatusUnauthorized)
	}

	// Case 3: Test login with a non-existent user.
	authReq.Username = "nonexistentuser"
	body, _ = json.Marshal(authReq)
	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(body))
	rr = httptest.NewRecorder()
	loginHandler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusNotFound {
		t.Errorf("handler returned wrong status code for non-existent user: got %v want %v", status, http.StatusNotFound)
	}
}

func TestAuthMiddleware(t *testing.T) {
	setupTestDB()

	// Register and log in a user to obtain a valid token.
	regReq := RegisterRequest{Username: "testuser", Password: "password"}
	body, _ := json.Marshal(regReq)
	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	middleware.ErrorHandler(Register).ServeHTTP(httptest.NewRecorder(), req)

	authReq := AuthRequest{Username: "testuser", Password: "password"}
	body, _ = json.Marshal(authReq)
	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(body))
	rr := httptest.NewRecorder()
	middleware.ErrorHandler(LoginHandler(testJWTSecret)).ServeHTTP(rr, req)
	var resp map[string]string
	json.Unmarshal(rr.Body.Bytes(), &resp)
	token := resp["token"]

	// Create a dummy handler that will be protected by the middleware.
	dummyHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	// Instantiate the auth middleware with the test secret.
	authMiddleware := middleware.NewAuthMiddleware(testJWTSecret)

	// Case 1: Request without a token.
	req, _ = http.NewRequest("GET", "/api/reconcile", nil)
	rr = httptest.NewRecorder()
	authMiddleware(dummyHandler).ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("middleware returned wrong status for no token: got %v want %v", status, http.StatusUnauthorized)
	}

	// Case 2: Request with an invalid token.
	req, _ = http.NewRequest("GET", "/api/reconcile", nil)
	req.Header.Set("Authorization", "Bearer invalidtoken")
	rr = httptest.NewRecorder()
	authMiddleware(dummyHandler).ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("middleware returned wrong status for invalid token: got %v want %v", status, http.StatusUnauthorized)
	}

	// Case 3: Request with a valid token.
	req, _ = http.NewRequest("GET", "/api/reconcile", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	rr = httptest.NewRecorder()
	authMiddleware(dummyHandler).ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("middleware returned wrong status for valid token: got %v want %v", status, http.StatusOK)
	}
}