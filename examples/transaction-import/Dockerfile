# Define function directory
ARG FUNCTION_DIR="/function"

FROM python:3.8.12-slim-bullseye as build-image

RUN apt-get update && apt-get install --no-install-recommends -y g++

ARG FUNCTION_DIR

RUN mkdir -p ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}

COPY requirements.txt ${FUNCTION_DIR}

RUN pip install -r requirements.txt --target ${FUNCTION_DIR}

RUN pip install \
        --target ${FUNCTION_DIR} \
        awslambdaric

FROM python:3.8.12-slim-bullseye

ARG FUNCTION_DIR
ARG PTI_API_BASE_URL
ARG PTI_CLIENT_ID
ARG PRIVATE_KEY
ARG PRIVATE_KEY_SECRET
ARG AWS_REGION

ENV PTI_API_BASE_URL=${PTI_API_BASE_URL:-"https://pti.apidev.pticlient.com"}
ENV PRIVATE_KEY=${PRIVATE_KEY}
ENV PRIVATE_KEY_SECRET=${PRIVATE_KEY_SECRET}
ENV AWS_REGION=${AWS_REGION:-"us-west-2"}

COPY pti_tools.py ${FUNCTION_DIR}
COPY lambda.py ${FUNCTION_DIR}
COPY transaction_importer.py ${FUNCTION_DIR}

RUN addgroup --system pti && adduser --system -group pti
USER pti
WORKDIR ${FUNCTION_DIR}

COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD [ "lambda.handler" ]
