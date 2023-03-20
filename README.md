# Pre-reqs

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)

# Getting started

- Clone the repository

```
git clone https://github.com/aagalyoon/CUDemo
```

- Install dependencies

```
cd CUDemo
npm install
```

- Configure your mongoDB server

```bash
# create the db directory
sudo mkdir -p /data/db
# give the db correct read/write permissions
sudo chmod 777 /data/db

# starting from macOS 10.15 even the admin cannot create directory at root
# so lets create the db directory under the home directory.
mkdir -p ~/data/db
# user account has automatically read and write permissions for ~/data/db.
```

- Start your mongoDB server (you'll probably want another command prompt)

```bash
mongod

# on macOS 10.15 or above the db directory is under home directory
mongod --dbpath ~/data/db
```

- Build and run the project

```
npm run build
npm start
```

# API Documentation

- Navigate to `http://localhost:3000` and you should see the API documentation!

# Unit Tests

```
npm run test
```

# Docker Container

```
docker-compose up --build
docker-compose run --rm app npm run test
```