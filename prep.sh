#!/bin/bash

if [ "$1" == "" ]; then
  echo "Usage ./prep.sh prod; ./prep.sh dev"
  exit 1
fi

if [ "$1" == "dev" ]; then
  sed -i -e 's#^var CLIENT_ID = "[^"]*";$#var CLIENT_ID = "38977793520-u51b5kpvkfuokp2ev9vb3vllfkl6oaqo.apps.googleusercontent.com";#g; s#^var CLIENT_SECRET = "[^"]*";$#var CLIENT_SECRET = "6s9Lnzi4QDq1oX5HDoJDRd_x";#g; s#^var CLIENT_CALLBACK = "[^"]*";$#var CLIENT_CALLBACK = "http://reliacode.com:8080";#g;' ./routes/auth.js
  sed -i -e 's#^[[:space:]]*"start": "[^"]*"[[:space:]]*$#    "start": "nodemon ./bin/www"#g;' ./package.json
fi

if [ "$1" == "prod" ]; then
  sed -i -e 's#^var CLIENT_ID = "[^"]*";$#var CLIENT_ID = "38977793520-2eute2ed36ddd4kjj6ss91d7vecsukpj.apps.googleusercontent.com";#g; s#^var CLIENT_SECRET = "[^"]*";$#var CLIENT_SECRET = "pzPiT1BcL_iDWdNZ8rxu75n-";#g; s#^var CLIENT_CALLBACK = "[^"]*";$#var CLIENT_CALLBACK = "https://reliacode.com";#g;' ./routes/auth.js
  sed -i -e 's#^[[:space:]]*"start": "[^"]*"[[:space:]]*$#    "start": "PORT=3002 nodemon ./bin/www"#g;' ./package.json
fi



