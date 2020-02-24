FROM node:12.2.0-alpine

RUN mkdir /front
WORKDIR /front

RUN mkdir /client
RUN mkdir /server

COPY /client /client/
COPY /server /server/
COPY package.json .
COPY package-lock.json .

RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
