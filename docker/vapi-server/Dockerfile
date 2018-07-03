FROM ubuntu

RUN apt-get update -yq \
    && apt-get install build-essential curl gnupg wget -yq \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash \
    && apt-get install nodejs git motion ffmpeg gdebi  -yq && apt-get autoremove -yq

RUN npm install -g @angular/cli
RUN wget https://github.com/Motion-Project/motion/releases/download/release-4.1.1/bionic_motion_4.1.1-1_amd64.deb \
&& gdebi bionic_motion_4.1.1-1_amd64.deb \
&& rm bionic_motion_4.1.1-1_amd64.deb && mkdir -p /var/log/motion && touch /var/log/motion/motion.log
RUN useradd -ms /bin/bash node

WORKDIR /home/node/
RUN git clone https://github.com/freakstatic/vapi-server && chown -R node:node /home/node

USER node
WORKDIR /home/node/vapi-server

RUN npm install && cd angular && npm install && npm run deploy
WORKDIR /home/node/vapi-server
CMD ["npm", "start"]