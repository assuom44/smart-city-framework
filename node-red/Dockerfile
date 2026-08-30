FROM nodered/node-red:5.0.4

USER root
COPY entrypoint.sh /usr/local/bin/smartcity-node-red-entrypoint.sh
RUN chmod 0755 /usr/local/bin/smartcity-node-red-entrypoint.sh
USER node

ENTRYPOINT ["/usr/local/bin/smartcity-node-red-entrypoint.sh"]
