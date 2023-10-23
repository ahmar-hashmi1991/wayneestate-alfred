#!/bin/bash

#create our working directory if it doesnt exist
DIR="/home/bitnami/alfred_server/wayneestate/"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir -p -v ${DIR}
fi