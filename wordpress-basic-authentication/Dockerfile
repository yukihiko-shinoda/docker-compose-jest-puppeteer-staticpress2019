FROM wordpress:apache
COPY ./entrypoint.sh /usr/bin/entrypoint
RUN chmod +x /usr/bin/entrypoint
ENTRYPOINT ["entrypoint"]
CMD ["apache2-foreground"]