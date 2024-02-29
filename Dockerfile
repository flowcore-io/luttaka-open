FROM node:slim

EXPOSE 3000/tcp
WORKDIR /usr/app
COPY ./ ./

SHELL ["/bin/bash", "-c"]

RUN apt update && \
    apt install openssl -y && \
    apt clean && \
    apt autoclean && \
    apt autoremove && \
    chmod +x scripts/image-startup.sh && \
    mv .container.env .env && \
    yarn --ignore-scripts && \

ENTRYPOINT ["/bin/bash", "-c", "scripts/image-startup.sh"]
