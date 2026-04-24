FROM node:20-alpine
WORKDIR /app

#Copy Backend Dependencies 
COPY backend/package*.json ./
RUN npm install 

#Copy Entire Project
COPY . .

#Move into backend
WORKDIR /app/backend

#Build
RUN npm run build

EXPOSE 3000
CMD ["npm","start"]