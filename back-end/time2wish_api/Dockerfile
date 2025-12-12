# --- ÉTAPE 1: ÉTAPE DE CONSTRUCTION (BUILD STAGE) ---
# Utiliser une image avec JDK et Maven
FROM maven:3.9.5-eclipse-temurin-21 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de construction (pom.xml) pour permettre la mise en cache des dépendances
COPY pom.xml .

# Télécharger les dépendances pour la mise en cache (si le pom.xml n'a pas changé)
RUN mvn dependency:go-offline

# Copier le reste du code source
COPY src ./src

# Compiler et empaqueter l'application en un fichier JAR exécutable
RUN mvn clean package -DskipTests

# --- ÉTAPE 2: ÉTAPE D'EXÉCUTION LÉGÈRE (PRODUCTION STAGE) ---
# Utiliser une image Java Runtime Environment (JRE) légère pour l'exécution
FROM eclipse-temurin:21-jre-alpine

# Arguments: Le nom du fichier JAR généré
ARG JAR_FILE=target/*.jar

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier JAR de l'étape de construction vers l'étape d'exécution
COPY --from=build /app/${JAR_FILE} app.jar

# Exposer le port de Spring Boot (généralement 8080)
EXPOSE 9000

# Commande d'exécution du JAR
ENTRYPOINT ["java", "-jar", "app.jar"]