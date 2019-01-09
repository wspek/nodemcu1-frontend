#!/bin/sh

DIR=`pwd`
FILE="${DIR}/e-charger-218218-serviceaccount.json"
PROJECT='e-charger-218218'

echo "${FILE}"

export GOOGLE_CLOUD_PROJECT=$PROJECT
export GOOGLE_APPLICATION_CREDENTIALS="${FILE}"
