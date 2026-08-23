# --- Build Stage ---
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
# Download dependencies to cache them
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests

# --- Runtime Stage ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add fontconfig & ttf-dejavu for Apache PDFBox to render properly on alpine
RUN apk add --no-cache fontconfig ttf-dejavu

# Copy built artifact
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 8000
# Tell Spring to run on port 8000 instead of default 8080 to match docker-compose config
ENV SERVER_PORT=8000

ENTRYPOINT ["java", "-jar", "app.jar"]
