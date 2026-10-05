# Stage 1: Build the Spring Boot application using Maven
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code and package application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal, secure JRE runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add a non-root system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create uploads directory structure with proper permissions
RUN mkdir -p /app/uploads/documents /app/uploads/products && \
    chown -R appuser:appgroup /app

# Copy the built jar from builder stage
COPY --from=builder /build/target/*.jar app.jar
RUN chown appuser:appgroup app.jar

USER appuser

ENV PORT=8080 \
    APP_UPLOAD_DIR=/app/uploads/documents

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
