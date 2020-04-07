FROM node:12.2.0-alpine

# apk is package installer for alpine
RUN apk add --no-cache \
	nano \
	vim \
	curl

RUN mkdir app
WORKDIR /app
RUN mkdir client && mkdir server

COPY . /app/

RUN npm install \
	--silent \
	react-scripts@3.0.1 -g --silent
