FROM hub.valentine.sfr.com/dockerhub/library/nginx:latest
ADD ca.crt /usr/local/share/ca-certificates/my-ca.crt
RUN chmod 644 /usr/local/share/ca-certificates/my-ca.crt && update-ca-certificates

COPY build /usr/share/nginx/html
WORKDIR /usr/share/nginx/html/

RUN rm -rf /etc/nginx/conf.d
ADD conf /etc/nginx