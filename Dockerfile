FROM node:12.22

WORKDIR /user/src/app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4500

CMD ["npm" , "start"]
