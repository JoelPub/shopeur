#!/usr/bin/env bash

set -v
set -e

docker run --rm \
    -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
    -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
    -e AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
    -v ${PWD}/_output/build:/current:ro \
    anigeo/awscli s3 cp --recursive --metadata-directive "REPLACE" --content-type "application/octet-stream" --acl "public-read" \
    /current/apk \
    s3://de-hrzg-shopeurope/shopeur/app/release/shopeur-${APP_VERSION}

docker run --rm \
    -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
    -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
    -e AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
    -v ${PWD}/_output/www:/current:ro \
    anigeo/awscli s3 cp --recursive --metadata-directive "REPLACE" --acl "public-read" \
    /current \
    s3://de-hrzg-shopeurope/shopeur/mobile/current
