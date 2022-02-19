const { app, BrowserWindow, Tray, Menu, shell, Notification, dialog } = require('electron');
const path = require('path');
const DiscordRPC = require('discord-rpc');
const fetch = require('request-promise');
const prettyMilliseconds = require('pretty-ms');
const express = require('express');
const server = express();

const iconPath = path.join(__dirname, './icons/logo.ico');

let appIcon = null;
let status = false;

if (require('electron-squirrel-startup')) {
	app.quit();
}

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		autoHideMenuBar: false,
		width: 1280,
		height: 720,
		minWidth: 1024,
		minHeight: 550,
		maximizable: true,
		resizable: true,
		frame: true,
		icon: iconPath,
		show: false,
		autoHideMenuBar: true.valueOf,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		}
	});

	mainWindow.on('ready-to-show', mainWindow.show);
	mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

server.use(express.json());

const client = new DiscordRPC.Client({ transport: 'ipc' });
client.on('error', error => {
	console.log(`An unexpected error occurred: ${error}`);
});

//Fetch function
server.post('/api/post-presence', (req, res) => {
	const { clientid, username, key } = req.body;
	if (status === true) {
		client.clearActivity().then(() => {
			status = false;
			console.log('Stopped Rich Presence\nThank you for using Last.fm Rich Presence');
		});
	} else {
		status = true;
		console.log('Started Rich Presence');
		async function fetchCurrentScrobble() {
			var TrackOptions = {
				uri: 'http://ws.audioscrobbler.com/2.0/',
				json: true,
				qs: {
					method: 'user.getrecenttracks',
					user: username,
					api_key: key,
					format: 'json',
					limit: '1'
				}
			};

			var lastTrack = await fetch(TrackOptions);
			if (!lastTrack)
				return console.log(
					'An unexpected error occurred while fetching\nPlease check if the Last.fm username provided is correct\nRetrying in 30 seconds...'
				);

			let lastArtist = lastTrack.recenttracks.track[0].artist['#text'];
			let lastTrackName = lastTrack.recenttracks.track[0].name;

			var UserOptions = {
				uri: 'http://ws.audioscrobbler.com/2.0/',
				json: true,
				qs: {
					method: 'track.getInfo',
					user: username,
					track: lastTrackName,
					artist: lastArtist,
					api_key: key,
					format: 'json'
				}
			};

			var fetchedData = await fetch(UserOptions);
			if (fetchedData.message && fetchedData.message === 'Track not found') {
				var data = {
					artist: lastTrack.recenttracks.track[0].artist['#text'],
					album: lastTrack.recenttracks.track[0].album['#text'],
					trackName: lastTrack.recenttracks.track[0].name,
					trackUrl: lastTrack.recenttracks.track[0].url,
					playcount: '0',
					scrobbleStatus: !lastTrack.recenttracks.track[0]['@attr']
						? `Last scrobbled ${prettyMilliseconds(Date.now() - lastTrack.recenttracks.track[0].date.uts * 1000)} ago
				`
						: 'Now scrobbling',
					cover: lastTrack.recenttracks.track[0].image[lastTrack.recenttracks.track[0].image.length - 1]['#text']
				};
			} else {
				var data = {
					artist: lastTrack.recenttracks.track[0].artist['#text'],
					album: lastTrack.recenttracks.track[0].album['#text'],
					trackName: lastTrack.recenttracks.track[0].name,
					trackUrl: lastTrack.recenttracks.track[0].url,
					playcount: fetchedData.track.userplaycount ? fetchedData.track.userplaycount : '0',
					scrobbleStatus: !lastTrack.recenttracks.track[0]['@attr']
						? `Last scrobbled ${prettyMilliseconds(Date.now() - lastTrack.recenttracks.track[0].date.uts * 1000)} ago
					`
						: 'Now scrobbling',
					cover: lastTrack.recenttracks.track[0].image[lastTrack.recenttracks.track[0].image.length - 1]['#text']
				};
			}
			return data;
		}

		//Status update function
		async function updateStatus() {
			var data = await fetchCurrentScrobble();

			// Verifying Data
			let detailsStatus = 'Listening to';
			if (data.scrobbleStatus !== 'Now scrobbling') detailsStatus = `Was ${detailsStatus}`;
			let albumName = data.album;
			if (data.album.length < 2) albumName = `${albumName}  `;

			client
				.setActivity({
					details: `${detailsStatus} ${data.trackName}`,
					buttons: [
						{
							label: `View on Last.fm - ${data.playcount} Scrobbles`,
							url: data.trackUrl
						}
					],
					state: `by ${data.artist} on ${data.album}`,
					largeImageKey: data.cover,
					largeImageText: albumName,
					smallImageKey:
						'https://raw.githubusercontent.com/Monochromish/Last.fm-Discord-Rich-Presence/main/assets/play.gif',
					smallImageText: data.scrobbleStatus,
					instance: false
				})
				.then(() => {
					console.log('Updating Rich Presence');
				});
		}

		//Running the update status every 30 seconds
		setInterval(function () {
			updateStatus();
		}, 30000);

		//Logging in RPC
		client.login({ clientId: clientid }).then(function () {
			updateStatus();
		});
	}
});

function createSystemTray() {
	appIcon = new Tray(iconPath);
	var contextMenu = Menu.buildFromTemplate([
		{
			label: 'Last.fm Rich Presence',
			click: function () {
				shell.openPath('https://github.com/Monochromish/Last.fm-Discord-Rich-Presence');
			}
		},
		{ label: 'Quit', type: 'normal', click: () => app.quit() }
	]);
	appIcon.setToolTip('Last.fm Rich Presence');
	appIcon.setContextMenu(contextMenu);
}

app.on('ready', function () {
	createWindow();
	createSystemTray();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.on('new-window', function (e, url) {
	e.preventDefault();
	require('electron').shell.openExternal(url);
});

server.listen(3000, () => {
	console.log('Listening at http://localhost:3000');
});
