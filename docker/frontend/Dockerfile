FROM node:22.12.0-alpine AS intermediate
LABEL stage=intermediate
WORKDIR /root/temp
COPY ./code/web/package*.json /root/temp/
RUN yarn

FROM node:22.12.0-alpine
WORKDIR /usr/app
COPY --from=intermediate /root/temp/node_modules ./node_modules
WORKDIR /usr
COPY ./docker/frontend/start.sh start.sh
RUN chmod +x /usr/start.sh

ENV NODE_ENV=development

CMD ["sh", "/usr/start.sh"]