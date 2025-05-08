ARG PARENT_VERSION=latest-22
ARG PORT=3000
ARG PORT_DEBUG=9229

FROM defradigital/node-development:${PARENT_VERSION} AS development

ENV TZ="Europe/London"

ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node-development:${PARENT_VERSION}

ARG PORT
ARG PORT_DEBUG
ENV PORT ${PORT}
EXPOSE ${PORT} ${PORT_DEBUG}

WORKDIR /home/node/app

RUN mkdir -p ./designer/client/src/assets/nunjucks

COPY --chown=node:node ./packag*.json ./
COPY --chown=node:node ./designer/package.json ./designer/
COPY --chown=node:node ./designer/bin/precompile.js ./designer/bin/
COPY --chown=node:node ./designer/precompile-govuk-components.js ./designer/
COPY --chown=node:node ./model/package.json ./model/

RUN npm ci

COPY --chown=node:node ./ ./

CMD [ "npm", "run", "dev" ]

FROM development as productionBuild

WORKDIR /home/node/app

ENV NODE_ENV production

RUN npm run build

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

WORKDIR /home/node/app

COPY --from=productionBuild --chown=node:node /home/node/app/packag*.json ./

COPY --from=productionBuild --chown=node:node /home/node/app/model/package.json ./model/
COPY --from=productionBuild --chown=node:node /home/node/app/model/dist ./model/dist

COPY --from=productionBuild --chown=node:node /home/node/app/designer/package.json ./designer/package.json
COPY --from=productionBuild --chown=node:node /home/node/app/designer/client/dist ./designer/client/dist
COPY --from=productionBuild --chown=node:node /home/node/app/designer/server/dist ./designer/server/dist

RUN npm ci --omit=dev

ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}

CMD [ "npm", "start", "--ignore-scripts" ]
