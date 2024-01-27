ARG PLATFORM_VERSION=lts-alpine

FROM node:$PLATFORM_VERSION  AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]
