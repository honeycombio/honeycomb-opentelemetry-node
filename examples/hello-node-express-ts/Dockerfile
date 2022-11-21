FROM node:16

# Create app directory
WORKDIR /usr/src/app

# copy everything from root directory (must use smoke-tests/docker-compose)
COPY . ./

# Install app dependencies
RUN npm install

# Run build script from root package.json
# this transpiles ts to js in /dist/src directory
RUN npm run build

# Bundle app source
COPY . .

# example app listens on port 3000
EXPOSE 3000

# symlink honeycomb sdk dependency
RUN cd ./examples/hello-node-express-ts/ && npm install && npm run build

# run example express app
CMD [ "node", "-r", "./examples/hello-node-express-ts/dist/instrumentation.js", "./examples/hello-node-express-ts/dist/index.js" ]
