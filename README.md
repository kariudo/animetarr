# Animetarr

Pronoucned [ˈanimādər] like "Animator", you can query scheduled or historical anime releases and add them to your Sonarr instance.

## Screenshot

![screenshot](./.assests/screenshot.png)

## Usage

There are two components: the Server (nodejs server) and the UI (Angular web client). To run the development assets and/or debug:

### Start the server

```sh
$ npm start
```

### Build the client UI

The client static site content can be built with the Angular CLI.

```sh
$ cd animetarr-ui
$ ng serve --watch
```