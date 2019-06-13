# NodeJS Docker authorisation plugin (PoC)

This is a PoC for a Docker authorisation plugin made in NodeJS.

The plugin allows only the execution of `docker ps` command and requires the
`X-Authz-Token` request header to be properly set (`YES-I-CAN`).

## Enable the plugin

1.  Run the authorisation app. It will listen on `localhost:9999`.

        $ npm install
        $ npm start

    Then, in another console...

2.  Stop the Docker daemon

        $ sudo systemctl stop docker.service

3.  Enable the plugin

        $ sudo cp ./docker-conf/daemon.json /etc/docker/daemon.json
        $ sudo mkdir /etc/docker/plugins
        $ sudo cp ./docker-conf/node-docker-authz.json /etc/docker/plugins/

4.  Set the authorisation token

        $ mkdir ~/.docker
        $ cp ./docker-conf/config.json ~/.docker/config.json

5.  Start the Docker daemon

        $ sudo systemctl start docker.service

## Check if everything is working properly

Try to run a new container. You should see something like that

    $ sudo docker run -ti --rm alpine:latest
    docker: Error response from daemon: authorization denied by plugin node-docker-authz: The URI /v1.39/containers/create is not allowed

Now, try to list the existing containers. It should work...

    $ sudo docker ps
    CONTAINER ID  IMAGE  COMMAND  CREATED  STATUS  PORTS  NAMES

If you change the authorisation token
    
    $ echo '{"HttpHeaders":{"X-Authz-Token":"NO-I-CAN-NOT"}}' > ~/.docker/config.json

you should see something like that

    $ docker ps
    Error response from daemon: authorization denied by plugin node-docker-authz: The authorisation token is not valid

## References

* [Access authorization plugin](https://docs.docker.com/engine/extend/plugins_authorization)
