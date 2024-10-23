# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY prisma ./prisma/
COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
