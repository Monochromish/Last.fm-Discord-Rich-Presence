# Last.FM Discord Rich Presence

An elegant, efficient and easy-to-setup Last.fm discord rich presence

![alt text](example.png 'Example')

## Works with

This Last.FM Discord Rich Presence works with all music platforms that Last.fm supports; such as:

[x] Spotify - Works best
[x] iTunes or Apple Music
[x] Youtube
[x] Google Play Music
[x] Tidal
[x] Deezer
[x] SoundCloud
[x] Mixcloud
[x] Sonos
[x] Hype Machine
[x] 8tracks
[x] Bandcamp
[x] Pandora
[x] And many more!

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
    "ClientID": "YOUR DISCORD APPLICATION ID HERE. KEEP IN MIND THIS WOULD BE THE NAME OF YOUR RICH PRESENCE",
    "Lastfm": {
        "Username": "YOUR LAST.FM ACCOUNT USERNAME",
        "API_Key": "YOUR LAST.FM API KEY",
        "API_Secret": "YOUR LAST.FM API SECRET"
    }
}
```

Save changes and open start.bat file.

## Credits

Code for this rich presence was written by [Monochromish](https://monolul.me).
If you come across any errors or need help with setting up, feel free to DM me on Discord.
