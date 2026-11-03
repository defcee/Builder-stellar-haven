FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 8080 8787

CMD ["/bin/sh", "-c", "npm run db:migrate && npx concurrently -n web,api -c cyan,magenta 'vite --host 0.0.0.0' 'tsx watch server/index.ts'"]
