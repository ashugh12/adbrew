FROM node:16

# Correct working directory (because your compose mounts /src to host repo)
WORKDIR /src/src/app

# Reliable registry for Docker builds
RUN yarn config set registry https://registry.npmjs.org/

# Copy dependency files first (layer caching)
COPY src/app/package.json src/app/yarn.lock ./


# Environment
ENV ENV_TYPE=staging
ENV MONGO_HOST=mongo
ENV MONGO_PORT=27017
ENV PYTHONPATH=$PYTHONPATH:/src/

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 1000000 --retry 5

# Copy all React source code
COPY src/app/ /src/src/app/

# Expose React dev server port
EXPOSE 3000

# Start React app
CMD ["yarn", "start"]
