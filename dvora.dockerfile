FROM node:12.14

WORKDIR /home/jpbaptista/projects/dvora

COPY yarn.lock ./
COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
