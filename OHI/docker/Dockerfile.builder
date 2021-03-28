FROM node:13-slim
LABEL maintainer="Ngoc Tran <ngoc.tq@3si.vn>"

WORKDIR /app

# Copy all local files into the image.
COPY ./package.json .
COPY ./package-lock.json .

RUN npm i --production --unsafe-perm && npm audit fix