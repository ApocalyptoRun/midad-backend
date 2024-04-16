FROM node:16

# Working Dir
WORKDIR /usr/src/app/backend

# Copy json Files
COPY package*.json ./

# Install Prettier ( for our packages build function)
#RUN npm install prettier -g

# Install Files
RUN npm install

# Copy source files
COPY . .

# Expose port 3030 for the application
EXPOSE 3030

# Command to run the application
CMD [ "npm", "run", "dev" ]