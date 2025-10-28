###
# Builder image
###
FROM node:20 AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY docker/wait-for.sh wait-for.sh
RUN chmod +x wait-for.sh

# After copying /app/dist
RUN rm -rf dist && mkdir dist

# Install dependecies
COPY package.json .
COPY package-lock.json .

RUN npm install

# Copy source (see .dockerignore)
COPY . .

RUN npx prisma generate

# Build source
RUN npm run build

###
# Production image
###
FROM node:20 AS app

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copy package manager
COPY --from=builder /app/package.json .

# Copy dependencies
COPY --from=builder /app/node_modules node_modules

# Copy code
COPY --from=builder /app/dist dist
COPY --from=builder /app/prisma prisma

COPY --from=builder /app/wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

EXPOSE 5555
EXPOSE 8080

CMD ["sh", "-c", "rm -rf /app/dist && npm run build && (npm run start:dev & npm run studio)"]