# specify the node base image with your desired version node:<version>
FROM node:11
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./src /app
COPY ./data /app/data
COPY ./config /config
CMD node ./bin/www
EXPOSE 3000
