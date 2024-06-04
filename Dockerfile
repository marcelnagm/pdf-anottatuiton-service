FROM node:16.15-alpine3.14 AS builder
ENV NEW_RELIC_NO_CONFIG_FILE=true
# Create app directory
EXPOSE 8000
RUN mkdir /workspace
WORKDIR /workspace
COPY . .
RUN npm install -g @types/node typescript ts-loader @nestjs/cli compression @nestjs/core @nestjs/common rxjs reflect-metadata
RUN npm install 
# RUN npx -p @nestjs/cli nest build
RUN npm run build 
# Bundle app source
RUN rm -fr ./src
CMD [ "npm", "run", "start"]
