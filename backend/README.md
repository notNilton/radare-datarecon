# Backend do Projeto de Reconciliação de Dados

Este diretório contém o código-fonte do servidor backend para o projeto de reconciliação de dados. O backend é construído em Go e fornece uma API REST para realizar a reconciliação de dados usando o método dos multiplicadores de Lagrange.

## Visão Geral

O objetivo principal deste backend é receber um conjunto de medições, suas tolerâncias e um conjunto de restrições lineares, e então ajustar as medições de forma que elas satisfaçam as restrições, minimizando o ajuste geral.

## Estrutura do Projeto

-   `main.go`: O ponto de entrada da aplicação. Ele inicializa o servidor HTTP, configura as rotas e lida com o graceful shutdown.
-   `internal/`: Este diretório contém a lógica de negócios principal da aplicação.
    -   `handlers/`: Contém os manipuladores de requisições HTTP para os endpoints da API.
    -   `reconciliation/`: Contém a lógica principal para o processo de reconciliação de dados.
    -   `middleware/`: Contém os middlewares para logging e tratamento de erros.
-   `go.mod`, `go.sum`: Gerenciam as dependências do projeto.
-   `CHANGELOG.md`: Um log de mudanças do backend.

## Endpoints da API

### 1. `POST /api/reconcile`

Este endpoint realiza a reconciliação dos dados.

**Corpo da Requisição (JSON):**

```json
{
  "measurements": [10.2, 20.5, 29.8],
  "tolerances": [0.01, 0.015, 0.02],
  "constraints": [
    [1, 1, -1]
  ]
}
```

-   `measurements`: Um array de números de ponto flutuante representando os valores medidos.
-   `tolerances`: Um array de números de ponto flutuante representando as tolerâncias percentuais para cada medição.
-   `constraints`: Uma matriz (array de arrays) representando as equações de restrição linear que as medições devem satisfazer.

**Resposta de Sucesso (JSON):**

```json
{
  "reconciled": [10.1, 20.4, 30.5]
}
```

-   `reconciled`: Um array de números de ponto flutuante com os valores ajustados.

### 2. `GET /api/current-values`

Este endpoint retorna valores de exemplo que são atualizados periodicamente no servidor.

**Resposta de Sucesso (JSON):**

```json
{
  "value1": 100,
  "value2": 50
}
```

### 3. `GET /healthz`

Este endpoint é usado para verificar a saúde do servidor.

**Resposta de Sucesso (JSON):**

```json
{
  "status": "ok"
}
```

## Configuração e Execução

### Pré-requisitos

-   Go 1.18 ou superior

### Passos

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/radare-datarecon.git
    cd radare-datarecon/backend
    ```

2.  **Instale as dependências:**

    ```bash
    go mod tidy
    ```

3.  **Execute o servidor:**

    ```bash
    go run main.go
    ```

    O servidor será iniciado na porta `8080` por padrão. Você pode definir a variável de ambiente `PORT` para usar uma porta diferente.

## Executando os Testes

Para executar os testes unitários do backend, navegue até o diretório `backend` e execute o seguinte comando:

```bash
go test ./...
```