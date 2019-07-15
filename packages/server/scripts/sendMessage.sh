#!/bin/bash

PLATFORM=$1
MSG=$2
ENDPOINT=https://server.local:3001/publish

if [ -z "$PLATFORM" ]; then
    echo "Supply platform and message"
    exit 1
fi

if [ -z "$MSG" ]; then
    echo "Please supply a message!"
    exit 1
fi

curl -X POST --cert certs/app/app.local.crt --key certs/app/app.local.key --cacert certs/ca/myCA.pem -d "{ \"data\":{\"level\":\"info\",\"tier\":2,\"topic\":\"${PLATFORM}\",\"message\":\"${MSG}\"}}" -H 'Content-Type: application/json' $ENDPOINT
