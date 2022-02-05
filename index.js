//Importing dependencies
const DiscordRPC = require('discord-rpc');
const config = require('./config.json');
const consola = require('consola');
const fetch = require('request-promise');
const prettyMilliseconds = require('pretty-ms');

//Verifying if config data is provided
if (!config.ClientID) {
	consola.error('ClientID must be provided in config.json');
} else if (!config.Lastfm.Username) {
	consola.error(
		"Last.fm Username must be provided in config.json\nIf you don't have a Last.fm account, go to https://www.last.fm/join and create an account."
	);
} else if (!config.Lastfm.API_Key) {
	consola.error(
		"Last.fm API Key must be provided in config.json\nIf you don't have a Last.fm API Key, go to https://www.last.fm/api/account/create and create an API."
	);
}

const client = new DiscordRPC.Client({ transport: 'ipc' });
client.on('ready', () => {
	consola.success(`Success!\nRegistered on user ${client.user.username}`);
});
client.on('error', error => {
	consola.error(`An unexpected error occurred: ${error}`);
});

//Fetch function
async function fetchCurrentScrobble() {
	var TrackOptions = {
		uri: 'http://ws.audioscrobbler.com/2.0/',
		json: true,
		qs: {
			method: 'user.getrecenttracks',
			user: config.Lastfm.Username,
			api_key: config.Lastfm.API_Key,
			format: 'json',
			limit: '1'
		}
	};

	var lastTrack = await fetch(TrackOptions);
	if (!lastTrack)
		return consola.error(
			'An unexpected error occurred while fetching\nPlease check if the Last.fm username provided is correct\nRetrying in 30 seconds...'
		);

	let lastArtist = lastTrack.recenttracks.track[0].artist['#text'];
	let lastTrackName = lastTrack.recenttracks.track[0].name;

	var UserOptions = {
		uri: 'http://ws.audioscrobbler.com/2.0/',
		json: true,
		qs: {
			method: 'track.getInfo',
			user: config.Lastfm.Username,
			track: lastTrackName,
			artist: lastArtist,
			api_key: config.Lastfm.API_Key,
			format: 'json'
		}
	};

	var fetchedData = await fetch(UserOptions);
	var data = {
		artist: lastTrack.recenttracks.track[0].artist['#text'],
		album: lastTrack.recenttracks.track[0].album['#text'],
		trackName: lastTrack.recenttracks.track[0].name,
		trackUrl: lastTrack.recenttracks.track[0].url,
		playcount: fetchedData.track.userplaycount ? fetchedData.track.userplaycount : '0',
		scrobbleStatus: !lastTrack.recenttracks.track[0]['@attr']
			? `Last scrobbled ${prettyMilliseconds(Date.now() - lastTrack.recenttracks.track[0].date.uts * 1000)} ago
			`
			: 'Now scrobbling ',
		cover: lastTrack.recenttracks.track[0].image[lastTrack.recenttracks.track[0].image.length - 1]['#text']
	};
	return data;
}

//Status update function
async function updateStatus() {
	var data = await fetchCurrentScrobble();

	client.setActivity({
		details: `Listening to ${data.trackName}`,
		buttons: [
			{
				label: 'View on Last.fm',
				url: data.trackUrl
			},
			{
				label: `${data.playcount} Scrobbles`,
				url: `https://www.last.fm/user/${config.Lastfm.Username}`
			}
		],
		state: `by ${data.artist} on ${data.album}`,
		largeImageKey: data.cover,
		largeImageText: data.album,
		smallImageKey: 'https://raw.githubusercontent.com/Monochromish/Last.fm-Discord-Rich-Presence/main/assets/play.gif',
		smallImageText: data.scrobbleStatus,
		instance: false
	});
}

//Running the update status every 30 seconds
setInterval(function () {
	updateStatus();
}, config.UpdateDelay);

//Logging in RPC
client.login({ clientId: config.ClientID });
