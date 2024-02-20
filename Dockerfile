ARG PARENT_VERSION=2.2.0-node20.3.0
ARG PORT=3000
ARG PORT_DEBUG=9229

FROM defradigital/node-development:${PARENT_VERSION} AS development

ENV TZ="Europe/London"

# FIXME
ENV NODE_OPTIONS="--openssl-legacy-provider"

ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node-development:${PARENT_VERSION}

ARG PORT
ARG PORT_DEBUG
ENV PORT ${PORT}
EXPOSE ${PORT} ${PORT_DEBUG}

RUN npm install --global yarn

WORKDIR /home/node/app

COPY --chown=node:node ./designer/package.json ./designer/yarn.lock ./designer/install_model.sh ./designer/
WORKDIR /home/node/app/designer

RUN bash install_model.sh
RUN yarn

WORKDIR /home/node/app
COPY --chown=node:node ./ ./
WORKDIR /home/node/app/designer

RUN yarn

CMD [ "yarn", "run", "dev" ]

FROM development as productionBuild

WORKDIR /home/node/app/designer
ENV NODE_ENV production

RUN yarn run build

FROM defradigital/node:${PARENT_VERSION} AS production

ENV TZ="Europe/London"

# Add curl to template.
# CDP PLATFORM HEALTHCHECK REQUIREMENT
USER root
RUN apk update && \
    apk add curl
USER node

ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node:${PARENT_VERSION}

COPY --from=productionBuild /home/node/app/designer/package*.json ./
COPY --from=productionBuild /home/node/app/designer/node_modules ./node_modules
COPY --from=productionBuild /home/node/app/designer/dist ./dist
COPY --from=productionBuild /home/node/app/designer/bin ./bin
COPY --from=productionBuild /home/node/app/designer/server ./server

ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}

CMD [ "yarn", "start" ]
