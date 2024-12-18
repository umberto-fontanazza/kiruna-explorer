FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]