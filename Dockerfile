ARG PARENT_VERSION=2.2.2-node20.11.1
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

COPY --chown=node:node ./packag*.json ./
COPY --chown=node:node ./designer/package.json ./designer/
COPY --chown=node:node ./model/package.json ./model/

RUN npm ci

COPY --chown=node:node . .
RUN npm run build

CMD [ "npm", "run", "dev" ]

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

COPY --from=development /home/node/app/ ./

RUN npm ci --omit=dev

ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}

CMD [ "npm", "start", "--ignore-scripts" ]
