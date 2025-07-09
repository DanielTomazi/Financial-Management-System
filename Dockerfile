FROM maven:3.8.4-openjdk-17-slim AS build

WORKDIR /app

# Copiar arquivos de configuração do Maven
COPY pom.xml .
COPY src ./src

# Construir a aplicação
RUN mvn clean package -DskipTests

# Usar uma imagem mais leve para produção
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copiar o JAR construído
COPY --from=build /app/target/Financial-Management-System-1.0-SNAPSHOT.jar app.jar

# Expor a porta da aplicação
EXPOSE 8080

# Definir o comando de inicialização
ENTRYPOINT ["java", "-jar", "app.jar"]
