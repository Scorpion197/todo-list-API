# Todo API

A simple todo API made with Nest.js

## Running the API locally

- Clone the repo and move to its directory using `https://github.com/Scorpion197/todo-list-API.git && cd todo-list-API`.
- create a `.env` file and fill it up as shown in `.env.example`.
- Make sure you have `docker` and `docker-compose` installed on your pc. Otherwise check this link: (install docker engine)[[install docker engine](https://docs.docker.com/engine/install/)]
- Once docker is ready, run this command: `docker-compose up -d`.
- run these commands: `npx prisma generate && npx prisma migrate dev` to create database tables.
- Finally run the development server using: `npm run start:dev`

## API documentation

The documentation of the API is automatically generated with swagger. You can find at `http://localhost:3000/api/v1/docs`
