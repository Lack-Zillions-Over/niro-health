FROM node:lts-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE ${PORT}

CMD [ "sh", "-c", "yarn start:prod"]
