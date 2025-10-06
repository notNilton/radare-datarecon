package config

// JWTSecret é a chave secreta para assinar os tokens JWT.
// Em um ambiente de produção, isso deve ser carregado de uma variável de ambiente ou de um cofre de segredos.
var JWTSecret = []byte("your_secret_key")