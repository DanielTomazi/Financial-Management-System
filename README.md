# Sistema de Gestão de Finanças Pessoais

## Visão Geral

Sistema completo de gestão de finanças pessoais desenvolvido com Spring Boot, Spring Security, JWT e PostgreSQL. A aplicação oferece funcionalidades avançadas para controle financeiro, incluindo categorização de transações, metas financeiras, relatórios detalhados e alertas automáticos por e-mail.

## Funcionalidades

### Autenticação e Autorização
- Autenticação JWT com Spring Security
- Sistema de registro e login seguro
- Autorização baseada em roles
- Validação automática de tokens

### Gestão de Transações
- CRUD completo de receitas e despesas
- Categorização automática por tipo de transação
- Histórico detalhado com filtros avançados
- Validações robustas de entrada de dados

### Categorias Personalizadas
- Categorias padrão criadas automaticamente
- Personalização completa com cores e ícones
- Soft delete para manter histórico
- Separação por tipo (receita/despesa)

### Metas Financeiras
- Três tipos de metas: Poupança, Limite de Gastos, Pagamento de Dívidas
- Acompanhamento automático do progresso
- Sistema de alertas por e-mail
- Estados dinâmicos (ativa, concluída, cancelada, pausada)

### Relatórios e Dashboard
- Dashboard interativo com resumo financeiro
- Relatórios mensais detalhados
- Gráficos por categoria para análise visual
- Comparativos temporais de receitas e despesas

### Sistema de Alertas
- Notificações automáticas por e-mail para metas concluídas
- Alertas de metas vencidas
- Notificações de progresso em marcos específicos
- Relatórios periódicos agendados

## Tecnologias Utilizadas

### Backend
- **Spring Boot 3.2.0** - Framework principal
- **Spring Security** - Autenticação e autorização
- **JWT** - Tokens de autenticação
- **Spring Data JPA** - Persistência de dados
- **PostgreSQL** - Sistema de gerenciamento de banco de dados
- **Spring Mail** - Sistema de envio de e-mails
- **Bean Validation** - Validação de dados de entrada

### Frontend
- **Angular 17** - Framework frontend
- **Angular Material** - Componentes de interface
- **Chart.js** - Biblioteca de gráficos
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS

### Documentação
- **Swagger/OpenAPI 3** - Documentação da API
- **SpringDoc OpenAPI** - Integração automática

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **Maven** - Gerenciamento de dependências

## Arquitetura

### Princípios Aplicados
- **Clean Code** - Código limpo e legível
- **SOLID** - Princípios de design orientado a objetos
- **GRASP** - Padrões de responsabilidade
- **DRY** - Don't Repeat Yourself
- **Single Responsibility** - Uma responsabilidade por classe

### Padrões de Design
- **Repository Pattern** - Camada de acesso a dados
- **Service Layer** - Lógica de negócio
- **DTO Pattern** - Transferência de dados
- **Builder Pattern** - Construção de objetos complexos
- **Strategy Pattern** - Diferentes tipos de metas financeiras

## Instalação e Execução

### Pré-requisitos
- Java 17 ou superior
- Docker e Docker Compose
- Maven 3.8 ou superior
- Node.js 18 ou superior

### Execução com Docker Compose (Recomendado)

```bash
# Clonar o repositório
git clone <repository-url>
cd Financial-Management-System

# Executar com Docker Compose
docker-compose up -d

# A aplicação estará disponível em:
# API: http://localhost:8080
# Frontend: http://localhost:4200
# Documentação: http://localhost:8080/swagger-ui.html
```

### Execução Local

#### Backend
```bash
# Instalar dependências e compilar
mvn clean install

# Executar PostgreSQL via Docker
docker run -d \
  --name financial-postgres \
  -e POSTGRES_DB=financial_management \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Executar aplicação Spring Boot
mvn spring-boot:run
```

#### Frontend
```bash
# Navegar para o diretório do frontend
cd financial-frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start
```

## Documentação da API

### Endpoints Principais

#### Autenticação
- `POST /api/auth/login` - Autenticação de usuário
- `POST /api/auth/register` - Registro de novo usuário
- `GET /api/auth/validate` - Validação de token JWT

#### Transações
- `GET /api/transactions` - Listar transações do usuário
- `POST /api/transactions` - Criar nova transação
- `PUT /api/transactions/{id}` - Atualizar transação existente
- `DELETE /api/transactions/{id}` - Remover transação
- `GET /api/transactions/dashboard` - Dados do dashboard
- `GET /api/transactions/report/monthly` - Relatório mensal

#### Categorias
- `GET /api/categories` - Listar categorias ativas
- `POST /api/categories` - Criar nova categoria
- `PUT /api/categories/{id}` - Atualizar categoria
- `DELETE /api/categories/{id}` - Remover categoria

#### Metas
- `GET /api/goals` - Listar metas do usuário
- `POST /api/goals` - Criar nova meta
- `PUT /api/goals/{id}` - Atualizar meta
- `DELETE /api/goals/{id}` - Remover meta
- `GET /api/goals/overdue` - Metas vencidas

### Acesso à Documentação
Após executar a aplicação, acesse: `http://localhost:8080/swagger-ui.html`

## Configuração

### Variáveis de Ambiente
```properties
# Configuração do Banco de Dados
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/financial_management
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# Configuração JWT
JWT_SECRET=your-secret-key-here

# Configuração de E-mail
EMAIL_USERNAME=your-email@example.com
EMAIL_PASSWORD=your-app-password
```

### Configuração de E-mail
Para habilitar o envio de e-mails automáticos:
1. Configure uma conta de e-mail
2. Gere uma senha de aplicativo (se usando Gmail)
3. Configure as variáveis EMAIL_USERNAME e EMAIL_PASSWORD
4. Ajuste as configurações SMTP conforme necessário

## Estrutura do Projeto

```
src/
├── main/
│   ├── java/
│   │   └── org/example/
│   │       ├── Main.java
│   │       ├── config/          # Configurações de segurança e JWT
│   │       ├── controller/      # Controllers REST
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── entity/         # Entidades JPA
│   │       ├── exception/      # Tratamento de exceções
│   │       ├── repository/     # Repositórios JPA
│   │       └── service/        # Serviços de negócio
│   └── resources/
│       └── application.yml     # Configurações da aplicação
├── financial-frontend/         # Aplicação Angular
├── docker-compose.yml         # Orquestração de containers
├── Dockerfile                 # Imagem da aplicação
└── pom.xml                    # Dependências Maven
```

## Segurança

- Autenticação JWT com tokens seguros
- Validação de entrada em todos os endpoints
- CORS configurado para frontend Angular
- Tratamento global de exceções
- Criptografia de senhas com BCrypt
- Autorização baseada em roles

## Frontend Responsivo

O sistema frontend foi desenvolvido com design responsivo:
- Interface adaptável para desktop, tablet e mobile
- Componentes Material Design
- Navegação otimizada para diferentes tamanhos de tela
- Gráficos interativos com Chart.js

## Desenvolvimento e Contribuição

### Padrões de Código
- Seguir convenções Java e TypeScript
- Documentação adequada de métodos públicos
- Testes unitários para funcionalidades críticas
- Commits descritivos seguindo padrões convencionais

### Build e Deploy

#### Produção
```bash
# Backend
mvn clean package
docker build -t financial-app .

# Frontend
npm run build
# Deploy da pasta dist/ para servidor web
```

## Monitoramento e Logs

- Logs estruturados com SLF4J
- Monitoramento de saúde via Spring Actuator
- Métricas de performance disponíveis
- Tratamento adequado de erros e exceções
