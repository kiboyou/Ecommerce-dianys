# the path : server/Dockerfile
FROM node:21

# create directory of work in the container
WORKDIR /app


# copy the neccesary files in the container
COPY . .

# install pnpm globally
RUN npm install -g npm@10.5.2
RUN npm install

# exposure port used by server
EXPOSE 3000

# running server
CMD ["npm", "run", "dev"]