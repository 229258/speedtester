FROM node:20.4.0-bookworm-slim
WORKDIR /usr/ps/speedtester
COPY . .
RUN npm install prompt

# docker network create --driver bridge ps_network
# docker build -t speedtester .

# docker run -it --entrypoint sh --network ps_network --cap-add=NET_ADMIN speedtester
