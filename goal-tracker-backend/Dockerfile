FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install
RUN apk add --no-cache openssl


COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

