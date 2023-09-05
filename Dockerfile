FROM node:20.4.0-bookworm-slim as ps
RUN apt-get update && apt-get install -y iproute2

FROM ps
WORKDIR /usr/ps/speedtester
RUN npm install prompt
COPY . .

# docker network create --driver bridge ps_network
# docker build -t speedtester .

# docker run -it --entrypoint bash --network ps_network --cap-add=NET_ADMIN speedtester
# tc qdisc add dev eth0 root tbf rate 1Mbit burst 10k latency 50ms