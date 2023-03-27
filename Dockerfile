FROM node:12.22.1 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG NODE_ENV
# RUN npm run build:$NODE_ENV

RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.20-alpine
COPY --from=build-stage /app/build/ /usr/share/nginx/html
