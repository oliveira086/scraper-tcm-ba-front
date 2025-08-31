FROM node:20-alpine
WORKDIR /app

# Keep the lockfile for deterministic installs
COPY package*.json ./
RUN npm ci

# Copy the rest
COPY . .

# Vite dev on 0.0.0.0:3000
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

