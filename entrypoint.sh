#!/bin/sh 
if [ "$DATABASE" = "postgres" ]

then
    echo "Waiting for postgres..."
    
    sleep 40

fi

npx prisma generate 
npx prisma migrate dev 
npm run start:dev