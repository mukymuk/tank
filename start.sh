#!/bin/sh
echo starting tank.js
logger starting tank.js

/usr/local/bin/node /usr/local/bin/forever start -o tank.log tank.js
