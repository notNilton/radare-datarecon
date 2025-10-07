// Package models define as estruturas de dados (modelos) da aplicação.
package models

import "gorm.io/gorm"

// Address representa o endereço de um usuário.
// Esta estrutura é incorporada na estrutura do usuário.
type Address struct {
	Street  string `json:"street"`
	City    string `json:"city"`
	State   string `json:"state"`
	ZipCode string `json:"zip_code"`
	Country string `json:"country"`
}

// User representa um usuário no sistema.
// Contém informações de autenticação e detalhes do perfil.
type User struct {
	gorm.Model
	Username     string  `gorm:"uniqueIndex;not null"` // Nome de usuário para login, deve ser único.
	Password     string  `gorm:"not null"`             // Senha hash para autenticação.
	Name         string  `json:"name"`                   // Nome completo do usuário.
	ContactEmail string  `gorm:"uniqueIndex;not null"` // E-mail de contato, deve ser único.
	Address      Address `gorm:"embedded"`             // Endereço do usuário, incorporado na tabela de usuários.
	ProfileIcon  string  `json:"profile_icon"`         // URL ou identificador para o ícone de perfil do usuário.
}