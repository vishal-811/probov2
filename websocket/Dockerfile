#Builder stage 

FROM node:20-alpine AS builder 

WORKDIR app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

# running Stage

FROM node:20-alpine 

WORKDIR app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder  /app/dist      ./dist

CMD ["node","dist/index.js"]
