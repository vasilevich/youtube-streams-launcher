const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');
const {OAuth2Client} = require('google-auth-library');
const express = require('express');
const { exec } = require('child_process');
const axios = require('axios');

const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];
const TOKEN_PATH = path.join(__dirname, 'assets', 'certs', 'token.json');
const clientSecretPath = path.join(__dirname, 'assets', 'certs', 'client_secret_221083376303-gr2e26fmql5nap9162t954fr4mjah9sl.apps.googleusercontent.com.json');

async function getLiveStreamUrl() {
  const content = await fs.promises.readFile(clientSecretPath);
  const auth = await authorize(JSON.parse(content));
  const liveStreamId = await listLiveStreams(auth);
  return liveStreamId;
}

async function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, "http://localhost:3000/authenticate");

  try {
    const token = await fs.promises.readFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    return getAccessToken(oAuth2Client);
  }
}

async function getAccessToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
    const app = express();

    app.get('/authenticate', async (req, res) => {
      const code = req.query.code;

      if (code) {
        try {
          const {tokens} = await oAuth2Client.getToken(code);
          oAuth2Client.setCredentials(tokens);
          await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(tokens));
          resolve(oAuth2Client);
        } catch (err) {
          reject(err);
        }
        res.send('Authentication successful! You can close this page.');
        server.close();
      } else {
        res.send('No code found in the URL. Please try again.');
      }
    });

    const server = app.listen(3000, () => {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });

      // Create the logs folder if it doesn't exist
      const logsDir = path.join(__dirname, 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
      }

      // Write the authUrl into a file named auth_url.txt in the logs folder
      const authUrlFilePath = path.join(logsDir, 'auth_url.txt');
      fs.writeFileSync(authUrlFilePath, authUrl);

      console.log('Authorization server is running on http://localhost:3000');
      console.log('Opening the authorization URL in the browser...');
      exec(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" "${authUrl}"`);
	  // open(authUrl, { app: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
   // exec(`start "Chrome" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" "${authUrl}"`);


    });
  });
}

async function listLiveStreams(auth) {
  const youtube = google.youtube({version: 'v3', auth});
  try {
    const response = await youtube.liveBroadcasts.list({
      part: 'snippet',
      broadcastStatus: 'active',
      broadcastType: 'all',
    //  mine: true,
      maxResults: 1,
    });
    const liveStreams = response.data.items;

    if (liveStreams.length > 0) {
      return `https://www.youtube.com/watch?v=${liveStreams[0].id}`;
    } else {
      return null;
    }
  } catch (error) {
	const e = 'Error fetching live streams:'+"\n"+ error.message;
    console.error(e);
	axios.get(`https://kuma.doar.systems/api/push/KHQPD9yFgv?status=up&msg=${encodeURIComponent(e)}&ping=`);
    return null;
  }
}

module.exports = getLiveStreamUrl;
