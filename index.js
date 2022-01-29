//Importing dependencies
const DiscordRPC = require('discord-rpc');
const config = require('./config.json');
const ClientID = config.ClientID;
const consola = require('consola');
const LastFmNode = require('lastfm').LastFmNode;

//Verifying if config data is provided
if (!config.ClientID) {
	consola.error('ClientID must be provided in config.json');
} else if (!config.Lastfm.Username) {
	consola.error(
		"Last.fm Username must be provided in config.json\nIf you don't have a Last.fm account, go to https://www.last.fm/join and create an account."
	);
} else if (!config.Lastfm.API_Key || !config.Lastfm.API_Secret) {
	consola.error(
		"Last.fm API Key and API Secret must be provided in config.json\nIf you don't have either of those, go to https://www.last.fm/api/account/create and create an API."
	);
}

//Signing in Last.fm API Account
const lastfm = new LastFmNode({
	api_key: config.Lastfm.API_Key,
	secret: config.Lastfm.API_Secret
});
const trackStream = lastfm.stream(config.Lastfm.Username);

const client = new DiscordRPC.Client({ transport: 'ipc' });
client.on('ready', () => {
	consola.success(`Success!\nAuthed for user ${client.user.username}`);
});
client.on('error', error => {
	consola.error(`An unexpected error occurred: ${error}`);
});

//Fetching User's Last.fm Data
trackStream.on('nowPlaying', function (track) {
	if (track['@attr'].nowplaying === 'true') {
		client.setActivity({
			details: `Listening to ${track.name}`,
			buttons: [
				{
					label: 'Play',
					url: track.url
				}
			],
			state: `by ${track.artist['#text']} on ${track.album['#text']}`,
			largeImageKey: track.image[3]['#text'],
			largeImageText: track.album['#text'],
			instance: false
		});
	}
});
trackStream.on('stoppedPlaying', function () {
	client.setActivity({
		details: `zZz`,
		largeImageKey: 'https://cdn.discordapp.com/app-assets/782685898163617802/810647037464936500.png',
		largeImageText: 'zZz',
		instance: false
	});
}); //TODO:Fix Idle Feature
trackStream.on('error', function (error) {
	return;
});
trackStream.start();

//Logging in RPC
client.login({ clientId: ClientID });
