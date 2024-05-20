FROM node as build-stage
WORKDIR /app
COPY . ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80