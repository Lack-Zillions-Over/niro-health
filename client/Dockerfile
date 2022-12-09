ARG NODE_VERSION=18-alpine

FROM node:${NODE_VERSION} AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:${NODE_VERSION} AS BUILD_IMAGE

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM node:${NODE_VERSION}

WORKDIR /app

COPY --from=BUILD_IMAGE /app/package.json /app/yarn.lock ./
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/next.config.js  ./
EXPOSE 3000

CMD [ "yarn", "start" ]
