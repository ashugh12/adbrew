FROM python:3.8-slim-bullseye

# Use bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Base system packages
RUN apt-get update -y && apt-get install -y \
    curl nano wget nginx git gnupg ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# --------------------------------------------------
# Install Yarn (secure method)
# --------------------------------------------------
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg \
    | gpg --dearmor \
    | tee /usr/share/keyrings/yarn.gpg > /dev/null

RUN echo "deb [signed-by=/usr/share/keyrings/yarn.gpg] https://dl.yarnpkg.com/debian stable main" \
    | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update -y && apt-get install -y yarn && \
    rm -rf /var/lib/apt/lists/*

# --------------------------------------------------
# Python / pip(Upgrade pip directly (easy_install is removed in modern Python))
# --------------------------------------------------
RUN python -m pip install --upgrade pip==23.3.2


# Environment
ENV ENV_TYPE=staging
ENV MONGO_HOST=mongo
ENV MONGO_PORT=27017
ENV PYTHONPATH=$PYTHONPATH:/src/

RUN apt-get update -y && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    make \
    python3-dev


# Install Python deps
COPY src/requirements.txt .
RUN pip install -r requirements.txt
