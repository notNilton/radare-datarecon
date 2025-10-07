package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application.
// Values are read from environment variables.
type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSslMode  string
	JWTSecret  string
	ServerPort string
}

// Load reads configuration from environment variables.
// It can optionally load from a .env file if it exists.
func Load() *Config {
	// Load .env file if it exists. Ignore the error if the file is not found.
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, proceeding with system environment variables.")
	}

	return &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "user"),
		DBPassword: getEnv("DB_PASSWORD", "password"),
		DBName:     getEnv("DB_NAME", "radare"),
		DBSslMode:  getEnv("DB_SSLMODE", "disable"),
		JWTSecret:  getEnv("JWT_SECRET", "your_secret_key"),
		ServerPort: getEnv("PORT", "8080"),
	}
}

// getEnv reads an environment variable or returns a fallback value.
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}