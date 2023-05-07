FROM node:16 as frontend-build
WORKDIR /usr/src/
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

FROM node:16 as backend-build
WORKDIR /usr/src
COPY backend/ ./backend/
RUN cd backend && npm install && NODE_ENV=production npm run build
RUN ls

FROM node:16 as ama-full
WORKDIR /root/
COPY --from=frontend-build /usr/src/frontend/build ./frontend
COPY --from=backend-build /usr/src/backend .
RUN ls
EXPOSE 80