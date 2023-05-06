FROM node:alpine as frontend-build
WORKDIR /app
COPY ./frontend/package.json package-lock.json ./
##ENV CI=1
RUN npm ci
COPY ./frontend/ .
RUN ls
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=frontend-build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]