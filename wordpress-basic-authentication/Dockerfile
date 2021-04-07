ARG WORDPRESS_IMAGE_TAG
FROM wordpress:${WORDPRESS_IMAGE_TAG}
RUN if [ -e /entrypoint.sh ] ; then mv /entrypoint.sh /usr/bin/docker-entrypoint.sh ; fi
COPY ./entrypoint.sh /usr/bin/entrypoint
RUN chmod +x /usr/bin/entrypoint
ENTRYPOINT ["entrypoint"]
CMD ["apache2-foreground"]
