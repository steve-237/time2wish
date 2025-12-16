# --- ÉTAPE 1: ÉTAPE DE CONSTRUCTION (BUILD STAGE) ---
# Utiliser une image Node.js récente pour la compilation
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de gestion des dépendances (package.json, package-lock.json)
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# pour la production, vous pouvez utiliser:
# Compiler l'application Angular (remplacez 'your-app-name' par le nom réel de votre projet si nécessaire)
# La sortie est généralement dans /dist/votre-projet
# RUN npm run build -- --output-path=./dist --configuration=production

# --- ÉTAPE 2: ÉTAPE D'EXÉCUTION LÉGÈRE (PRODUCTION STAGE avec Nginx) ---
# Utiliser une image Nginx légère pour servir les fichiers statiques
# FROM nginx:alpine AS production-stage

# Copier la configuration Nginx personnalisée pour Angular (voir ci-dessous)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers statiques compilés de l'étape de construction
# Assurez-vous que le chemin /app/dist est correct pour votre configuration Angular
# COPY --from=build /app/dist /usr/share/nginx/html

# Le port par défaut de Nginx pour le frontend
# EXPOSE 80

# La commande de démarrage de Nginx est intégrée à l'image de base
# CMD ["nginx", "-g", "daemon off;"]

# pour le développement, vous pouvez utiliser:
# Expose le port de Angular CLI
EXPOSE 4200

# La commande d'exécution est définie dans docker-compose.dev.yml (npm run start)
CMD ["npm", "run", "start"]