FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Create storage directory
RUN mkdir -p .next

EXPOSE 3000

CMD ["npm", "run", "dev"]
