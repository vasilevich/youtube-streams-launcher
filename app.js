require('log-timestamp')(function() { return `(${new Date().toString()}): %s`; });

const express = require('express');
const shell = require('shelljs');
const cors = require('cors');
const app = express();
const port = 25000;
const getLiveStreamUrl = require('./youtube');
const { spawn } = require('child_process');
const potPlayerPath = 'C:\\Program Files\\DAUM\\PotPlayer\\PotPlayerMini.exe';
let potPlayerProcess;
let interval =5 * 1000; // 5 seconds
let currentYoutubeUrl = null

const checkLiveStream = async () => {
  const youtubeUrl = await getLiveStreamUrl();
  if (youtubeUrl !== null) {
	  console.log(`Live stream found: ${youtubeUrl}`);
    if (!potPlayerProcess) {
		console.log("Launching pot player with live stream url");
      potPlayerProcess = spawn(potPlayerPath, [youtubeUrl]);
	  
    } else {
		console.log("Waiting for livestream to finish...");
	}
  } else {
    if (potPlayerProcess && youtubeUrl!==currentYoutubeUrl) {
	 console.log("Livestream finished");
	  console.log("Killing potplayer");
      potPlayerProcess.kill();
      potPlayerProcess = null;
    } else {
		console.log(`No youtube stream found.`);
	}
  }

  setTimeout(checkLiveStream, interval);
};

checkLiveStream();


app.use(cors());

app.get('/youtube', (req, res) => {
  const url = req.query.url;

  if (!url) {
    res.status(400).send('URL parameter is required');
    return;
  }

  const decodedUrl = decodeURIComponent(url);
  shell.exec(`start "" "${potPlayerPath}" "${decodedUrl}" /fullscreen`);

  res.send('PotPlayer launched in fullscreen mode');
});

app.get('/shutdown', (req, res) => {
  shell.exec('shutdown /s /t 0');
  res.send('Shutting down the computer');
});

app.get('/sleep', (req, res) => {
  shell.exec('rundll32.exe powrprof.dll, SetSuspendState Sleep');
  res.send('Sending computer to sleep');
});

app.get('/hibernate', (req, res) => {
  shell.exec('rundll32.exe powrprof.dll, SetSuspendState Hibernate');
  res.send('Sending computer to hibernate');
});

app.get('/ping', (req, res) => {
  res.send('ok');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
