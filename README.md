#VAPi Server
This project uses [Motion](https://github.com/Motion-Project/motion) to detect movement and to save a picture of that movement. <br/>
Then receives, by websocket, the [node-object-detection](https://github.com/freakstatic/node-object-detection) (Yolo) analyze with the objects <br/> 
detected in that picture. This information is saved in the database so it can be displayed<br/> to the user on the angular web interface.
 

### Prerequisites
* [Node.js](https://nodejs.org/en/)
* [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04) or MariaDB Server
* [Motion](https://github.com/Motion-Project/motion)

  
## Getting started 
Run MariaDB docker container
```
docker-compose -f mariadb/docker-compose.yml up -d
```


Run angular in development
```
cd angular
npm install
npm start	
```
Run Node.js server
```
npm install
npm start
```
## Deployment
Build angular files for deployment

```
cd angular && npm install && npm run deploy
```
Run Node.js server
```
npm install
npm start
```
Run MariaDB docker container
```
docker-compose -f mariadb/docker-compose.yml up -d
```

### Config Files
Database
```
ormconfig.json
```

Geral configurations
```
config.json
```

Motion configurations
```
motion/motion.conf
```