ARG WORDPRESS_IMAGE_TAG
ARG MODERNITY

FROM wordpress:${WORDPRESS_IMAGE_TAG} AS modern

FROM wordpress:${WORDPRESS_IMAGE_TAG} AS legacy
RUN mv /entrypoint.sh /usr/bin/docker-entrypoint.sh

FROM ${MODERNITY}
COPY ./entrypoint.sh /usr/bin/entrypoint
RUN chmod +x /usr/bin/entrypoint
ENTRYPOINT ["entrypoint"]
CMD ["apache2-foreground"]
