package database

import (
	"fmt"
	"log"
	"radare-datarecon/backend/internal/config"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(cfg *config.Config) {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=UTC",
		cfg.DBHost,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
		cfg.DBPort,
		cfg.DBSslMode,
	)

	log.Printf("Attempting to connect to database: host=%s, dbname=%s", cfg.DBHost, cfg.DBName)

	// Adicionar retry logic
	for i := 0; i < 10; i++ {
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Printf("Failed to connect to database (attempt %d/10): %v", i+1, err)
			time.Sleep(2 * time.Second)
			continue
		}

		// Testar a conexão
		sqlDB, err := DB.DB()
		if err == nil {
			err = sqlDB.Ping()
		}

		if err != nil {
			log.Printf("Failed to ping database (attempt %d/10): %v", i+1, err)
			time.Sleep(2 * time.Second)
			continue
		}

		log.Println("Successfully connected to database!")
		return
	}

	log.Fatalf("Failed to connect to database after 10 attempts: %v", err)
}
