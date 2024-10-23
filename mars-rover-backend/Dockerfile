# Dockerfile

FROM node:16-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci

COPY --from=build /app/dist /app/dist
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/prisma/migrations /app/prisma/migrations

RUN chmod -R 755 /app/prisma/migrations


EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
