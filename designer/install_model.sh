#!/usr/bin/env bash

# TODO refactor this into a separate github workflow to build and push to a registry, then read in as a normal dependency in designer and forms-runner

# cd $(dirname $0)

# cd ../model && yarn && yarn build && cd -

# yarn add ../model


test -d /tmp/xgov-model || git clone https://github.com/XGovFormBuilder/digital-form-builder.git /tmp/xgov-model

cd /tmp/xgov-model/model && yarn && yarn build && cd -

yarn add /tmp/xgov-model/model/