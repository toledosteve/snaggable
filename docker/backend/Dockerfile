FROM node:22.12.0-alpine AS intermediate
LABEL stage=intermediate
WORKDIR /root/temp
COPY ./code/backend/package*.json /root/temp/
RUN yarn

FROM node:22.12.0-alpine
WORKDIR /usr/app
COPY --from=intermediate /root/temp/node_modules ./node_modules
RUN npm install -g @nestjs/cli
WORKDIR /usr
COPY ./docker/backend/start.sh start.sh
RUN chmod +x /usr/start.sh
CMD ["sh", "/usr/start.sh"]