#!/bin/bash

EVENT_NAME=$1
MSG=$2
ENDPOINT=https://server.local:3001/publish

if [ -z "$EVENT_NAME" ]; then
    echo "Supply event name and message"
    exit 1
fi

if [ -z "$MSG" ]; then
    echo "Please supply a message!"
    exit 1
fi

curl -X POST --cert certs/app/app.local.crt --key certs/app/app.local.key --cacert certs/ca/myCA.pem -d "{ \"eventName\":\"${EVENT_NAME}\", \"data\":{\"level\":\"info\",\"message\":\"${MSG}\"}}" -H 'Content-Type: application/json' $ENDPOINT
