FROM node:16

# Create app directory
WORKDIR /usr/src/app
# copy everything from root directory (using docker-compose)
COPY . ./

# Install app dependencies
RUN npm install

# Run build script from root package.json
# this transpiles ts to js in /dist/src directory
RUN npm run build

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

# run example script from root package.json
CMD [ "npm", "run", "example-node" ]
