# VAPi Server
This project uses [Motion](https://github.com/Motion-Project/motion) to detect movement and to save a picture of that movement.
Then receives, by websocket, the [node-object-detection](https://github.com/freakstatic/node-object-detection) (Yolo) analysis with the objects 
detected in that picture. This information is saved in the database so it can be displayed to the user on the angular web interface.
 

### Prerequisites
* [Node.js](https://nodejs.org/en/)
* [node-object-detection](https://github.com/freakstatic/node-object-detection)
* [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04) or MariaDB Server
* [Motion](https://github.com/Motion-Project/motion)
* [FFmpeg](https://www.ffmpeg.org/)

  
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
Run MariaDB docker container
```
docker-compose -f mariadb/docker-compose.yml up -d
```


Build angular files for deployment
```
cd angular && npm install && npm run deploy
```

Run Node.js server
```
npm install
npm start
```

### Config Files
Database configurations
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