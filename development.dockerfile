FROM node:lts-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE ${PORT}

CMD [ "sh", "-c", "yarn start:debug"]
