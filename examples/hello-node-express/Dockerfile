FROM node:16

# Create app directory
WORKDIR /usr/src/app
# copy everything from root directory (using docker-compose)
COPY . ./
# COPY ./dist /usr/dist

# Install app dependencies
RUN npm install

# Run build script from root package.json
# this transpiles ts to js in /dist/src directory
RUN npm run build

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
# COPY ./examples/hello-node-express .

# RUN npm ci --only=production

EXPOSE 3000

RUN cd ./examples/hello-node-express/ && npm install

# run example script from root package.json
# CMD [ "npm", "run", "example-node-express" ]
# CMD [ "npm", "install", "&&", "npm", "start" ]
# CMD [ "npm", "start" ]
# CMD [ "npm", "run", "example-ci" ]
CMD [ "node", "./examples/hello-node-express/index.js" ]
