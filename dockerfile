# Stage 1
FROM node:8.12.0 as react-build
WORKDIR /app
ARG ENVIRONMENT
COPY . ./
RUN yarn install
RUN if [ "x$ENVIRONMENT" = "x" ] ; then yarn build:DEV ; else yarn build:$ENVIRONMENT ; fi

# Stage 2 - the production environment
FROM nginx:alpine
# COPY nginx.conf ./
COPY --from=react-build /app/build /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]