FROM node:16-alpine3.13
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["./src/package.json","."]
RUN npm install --production --silent
COPY ./src .
CMD ["npm", "start"]

