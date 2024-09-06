FROM public.ecr.aws/docker/library/node:20.11.0-alpine3.19 As development

WORKDIR /app

COPY package*.json ./
COPY newrelic.js ./
COPY rds-combined-ca-bundle.pem ./
COPY prisma ./prisma/

RUN npm pkg delete scripts.prepare
RUN npm install

COPY . .

RUN npm run build

FROM public.ecr.aws/docker/library/node:20.11.0-alpine3.19 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./
COPY newrelic.js ./
COPY rds-combined-ca-bundle.pem ./
COPY prisma ./prisma/

RUN npm pkg delete scripts.prepare
RUN npm install --omit=dev

COPY . .

COPY --from=development /app/dist ./dist

CMD [ "npm", "run", "start:prod:migrate" ]
