# FROM node:14-alpine As builder
FROM node:20

WORKDIR /projects/frontend

COPY frontend/package.json ./
COPY frontend/package-lock.json ./

RUN npm install -g @angular/cli
RUN npm install

EXPOSE 4200
