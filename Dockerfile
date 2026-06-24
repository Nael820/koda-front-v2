FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g serve

EXPOSE 4000

CMD ["serve", ".", "-p", "4000"]