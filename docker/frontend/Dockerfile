# FROM node:14 as builder

# WORKDIR /usr/src/app

# COPY ./package.json ./
# COPY ./package-lock.json ./

# RUN npm install -g @angular/cli@14.0.4
# RUN npm ci --production
# RUN npm install -D @angular-devkit/build-angular@14.0.4

# COPY . .

# ARG BUILD_ENV

# RUN npm run build -- --configuration ${BUILD_ENV}

# FROM nginx:1.17.1-alpine

# COPY --from=builder /usr/src/app/dist/angular-app/ /usr/share/nginx/html
# COPY --from=builder /usr/src/app/nginx/default.conf /etc/nginx/conf.d/default.conf
FROM node

WORKDIR /frontend

COPY frontend/package.json ./
COPY frontend/package-lock.json ./

# RUN npm install @angular-devkit/build-angular
RUN npm install -g @angular/cli
RUN npm install

EXPOSE 4200
