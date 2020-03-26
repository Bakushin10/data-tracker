FROM bayesimpact/react-base

#RUN mkdir /front
#WORKDIR /front
RUN cd /usr/app
WORKDIR /usr/app/
RUN pwd

RUN mkdir client
RUN mkdir server
RUN ls

COPY /client client/
COPY /server server/
COPY package.json .
COPY package-lock.json .
RUN pwd
RUN ls

RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent

RUN npm i webpack-pwa-manifest
RUN npm i imagemin-mozjpeg
RUN npm i imagemin-optipng
RUN npm i imagemin-svgo
