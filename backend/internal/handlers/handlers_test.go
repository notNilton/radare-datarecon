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

func setupTestDB() {
	var err error
	database.DB, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}
	database.DB.AutoMigrate(&models.User{})
}

func TestRegister(t *testing.T) {
	setupTestDB()

	// Test successful registration
	authReq := AuthRequest{Username: "testuser", Password: "password"}
	body, _ := json.Marshal(authReq)
	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	rr := httptest.NewRecorder()
	handler := middleware.ErrorHandler(Register)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusCreated)
	}

	// Test duplicate registration
	req, _ = http.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusInternalServerError {
		t.Errorf("handler returned wrong status code for duplicate registration: got %v want %v", status, http.StatusInternalServerError)
	}
}

func TestLogin(t *testing.T) {
	setupTestDB()

	// Register a user first
	authReq := AuthRequest{Username: "testuser", Password: "password"}
	body, _ := json.Marshal(authReq)
	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	rr := httptest.NewRecorder()
	handler := middleware.ErrorHandler(Register)
	handler.ServeHTTP(rr, req)

	// Test successful login
	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(body))
	rr = httptest.NewRecorder()
	loginHandler := middleware.ErrorHandler(Login)
	loginHandler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var resp map[string]string
	json.Unmarshal(rr.Body.Bytes(), &resp)
	if resp["token"] == "" {
		t.Errorf("handler returned no token on successful login")
	}

	// Test login with wrong password
	authReq.Password = "wrongpassword"
	body, _ = json.Marshal(authReq)
	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(body))
	rr = httptest.NewRecorder()
	loginHandler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code for wrong password: got %v want %v", status, http.StatusUnauthorized)
	}

	// Test login with non-existent user
	authReq.Username = "nonexistent"
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

	// Register and login user to get a token
	authReq := AuthRequest{Username: "testuser", Password: "password"}
	body, _ := json.Marshal(authReq)
	req, _ := http.NewRequest("POST", "/api/register", bytes.NewBuffer(body))
	rr := httptest.NewRecorder()
	middleware.ErrorHandler(Register).ServeHTTP(rr, req)

	req, _ = http.NewRequest("POST", "/api/login", bytes.NewBuffer(body))
	rr = httptest.NewRecorder()
	middleware.ErrorHandler(Login).ServeHTTP(rr, req)
	var resp map[string]string
	json.Unmarshal(rr.Body.Bytes(), &resp)
	token := resp["token"]

	// Dummy handler to be protected by middleware
	dummyHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Test case 1: No token
	req, _ = http.NewRequest("GET", "/api/reconcile", nil)
	rr = httptest.NewRecorder()
	middleware.AuthMiddleware(dummyHandler).ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("middleware returned wrong status code for no token: got %v want %v", status, http.StatusUnauthorized)
	}

	// Test case 2: Invalid token
	req, _ = http.NewRequest("GET", "/api/reconcile", nil)
	req.Header.Set("Authorization", "Bearer invalidtoken")
	rr = httptest.NewRecorder()
	middleware.AuthMiddleware(dummyHandler).ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("middleware returned wrong status code for invalid token: got %v want %v", status, http.StatusUnauthorized)
	}

	// Test case 3: Valid token
	req, _ = http.NewRequest("GET", "/api/reconcile", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	rr = httptest.NewRecorder()
	middleware.AuthMiddleware(dummyHandler).ServeHTTP(rr, req)
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("middleware returned wrong status code for valid token: got %v want %v", status, http.StatusOK)
	}
}