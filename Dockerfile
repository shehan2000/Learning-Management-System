
FROM node:20.19.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma migrate dev --name

RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]