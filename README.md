# Animetarr

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-blu.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org)
[![Buymeacoffee](https://badgen.net/badge/icon/buymeacoffee?icon=buymeacoffee&label)]([https://https://www.buymeacoffee.com/](https://www.buymeacoffee.com/kariudo))



Pronoucned [ˈanimādər] like "Animator", you can query scheduled or historical anime releases and add them to your Sonarr instance.

## Screenshot

![screenshot](./.assests/screenshot.png)

## Usage

There are two components: the Server (nodejs server) and the UI (Angular web client). To run the development assets and/or debug:

### Start the server

You will need to make your `.env` file to reflect your settings. You can start by copying the `.env.example` file to `.env` and entering your approparite values.

```shell
$ npm start
```

### Build the client UI

The client static site content can be built with the Angular CLI.

```shell
$ cd animetarr-ui
$ ng serve --watch
```

## Now what?

After launching the client in your browser (most likely from `localhost:3000`), you should be shown the current airing season of programming. In the bottom right of each card you can press the `+` FAB to select series that should be added to your Sonarr instance. Shows that have already been added should have a disabled button and a checkmark shown in place of the button.

The bottom left corner of each card also provides a button to mark(hide) shows that are mismatched (if it's something annoying), as well as a button to search YouTube for a any video previews to help decide if the series is worth your time.

## Where does the data come from?

The scheduling information by season is pulled from the AniList graphql API, and additional supporting details are pulled from the TVDB since we need those to leverage an exact match for Sonarr.
