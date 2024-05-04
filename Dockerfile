FROM node:20.10.0

WORKDIR /home/api

COPY package.json .

RUN npm install

COPY . .
COPY ./entrypoint.sh /home/api/
RUN chmod +x /home/api/entrypoint.sh
EXPOSE 3000


ENTRYPOINT [ "./entrypoint.sh" ]