# specify the node base image with your desired version node:<version>
FROM node:11
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./src /app/src
COPY ./data /app/data
COPY ./config /app/config
CMD node ./src/bin/www
EXPOSE 3000
