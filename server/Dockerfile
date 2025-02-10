FROM node:20-alpine  as builder

WORKDIR app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build


FROM node:20-alpine  as runner

WORKDIR app

COPY --from=builder /app/node_modules  ./node_modules
COPY --from=builder /app/dist   ./dist

CMD ["node", "dist/index.js"]