# Last.FM Discord Rich Presence

An elegant, efficient, easy-to-setup and arguably the best Last.fm discord rich presence!

Supports GIF album covers and provides information such as `Track name`, `Track Album`, `Track Artist`, `Last Played`, `Your Scrobbles` and much more!
Customizable and by default, it updates status every 30 seconds.

![alt text](Example.gif 'Example')

## Works with

This Last.FM Discord Rich Presence works with all music platforms that Last.fm supports; such as:

- [x] Spotify - Works best
- [x] iTunes or Apple Music
- [x] Youtube
- [x] Google Play Music
- [x] Tidal
- [x] Deezer
- [x] SoundCloud
- [x] Mixcloud
- [x] Sonos
- [x] Hype Machine
- [x] 8tracks
- [x] Bandcamp
- [x] Pandora
- [x] And many more!

## Requirements

1. Node.js from [here](https://nodejs.org).
2. Last.fm account from [here](https://www.last.fm/join) and a Last.fm API from [here](https://www.last.fm/api/account/create).
3. A Discord Application from [here](https://discord.com/developers/applications)

## How to setup

1. Download or Clone this repository.
2. Open terminal or console in the root folder and run `npm install`. This is a one-time operation; It installs the required dependencies.
3. Open the file named config.json in a text editor or an IDE and modify it.
   It should then look something like this:

```js
{
    "ClientID": "936982107106967602", //Don't change this unless you have a discord client application of your own. | Optional
    "Lastfm": {
        "Username": "YOUR LAST.FM ACCOUNT USERNAME", //Required
        "API_Key": "YOUR LAST.FM API KEY" //Required
    },
    "UpdateDelay": "30000" //Don't change this unless you know what you are doing; Decreasing this may cause errors or may possible get your API rate-limited!
}
```

Save changes and open start.bat file.

## Contribution and issues

Feel free to fork this repository and create pull requests, I will review them when I get notified.

## Credits

Code for this rich presence was fully written by [Monochromish](https://monolul.me) (_at the time of writing this_) and no credits to me are being provided in the rich presence! Please share this repository to support this project.
If you come across any errors or need help with setting up, feel free to DM me on Discord.
