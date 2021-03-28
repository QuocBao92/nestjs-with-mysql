ARG TAG=develop-builder
ARG IMAGE=idn-backend
FROM ${IMAGE}:${TAG} as builder
# Set working directory
WORKDIR /app
# Copy all local files into the image.
COPY . .
# Install packages
RUN npm i
# Build for production.
RUN npm run build

FROM ${IMAGE}:${TAG}
# The node is running on port 3000, so expose it
EXPOSE 3000
# Set working directory
WORKDIR /app
# Copy build's content to HTML serving folder of nginx container
COPY --from=builder /app/dist dist 
#Copy environment
COPY config config

ENTRYPOINT ["node", "/app/dist/src/main.js"]