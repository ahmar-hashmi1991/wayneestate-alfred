#!/bin/bash

# source env variables

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" == "master" ]]; then
    export DB_USERNAME=abhishekJ
    export DB_PASSWORD=G7ezVjUAImqFebEt

    export UNICOM_USERNAME=tech@bizztm.com
    export UNICOM_PASSWORD=Sprint@001

    export BASE_URL_AUTH=https://bizztm.unicommerce.com/oauth/token?
    export BASE_URL=https://bizztm.unicommerce.com/

    export ALL_FACILITY=bizztm, BizzTM-RJ20
    export LIVE_DELHI_FAC_CODE=bizztm
    export LIVE_KOTA_FAC_CODE=BizzTM-RJ20
    export SALE_ORDER_ID_ENV_POSTFIX=P

    export NODE_ENV=prod
else
    export DB_USERNAME=abhishekJ
    export DB_PASSWORD=G7ezVjUAImqFebEt

    export UNICOM_USERNAME=abhishek.joseph@bizztm.com
    export UNICOM_PASSWORD=Sprint@001

    export BASE_URL_AUTH=https://stgbizztm.unicommerce.com/oauth/token?
    export BASE_URL=https://stgbizztm.unicommerce.com

    export ALL_FACILITY=stgbizztm
    export LIVE_DELHI_FAC_CODE=bizztm
    export LIVE_KOTA_FAC_CODE=BizzTM-RJ20
    export SALE_ORDER_ID_ENV_POSTFIX=D

    export NODE_ENV=dev
fi

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/bitnami/alfred_server/wayneestate

#navigate into our working directory where we have all our github files
cd /home/bitnami/alfred_server/wayneestate/server

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
npm install

# forever stop running app
npx forever stop build/app.js

#start our node app in the background
npm run build
npx forever start build/app.js