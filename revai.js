const revai = require('revai-node-sdk');
const WebSocket = require('ws');

const token = '<REVAI_ACCESS_TOKEN>';

// initialize client with audio configuration and access token
const audioConfig = new revai.AudioConfig(
    /* contentType */ "audio/x-raw",
    /* layout */      "interleaved",
    /* sample rate */ 16000,
    /* format */      "S16LE",
    /* channels */    1
);

let client = new revai.RevAiStreamingClient(token, audioConfig);

// create websocket server
const wss = new WebSocket.Server({ port: 8080 });

// create event responses for the client
client.on('close', (code, reason) => {
    console.log(`Connection closed, ${code}: ${reason}`);
});
client.on('httpResponse', code => {
    console.log(`Streaming client received http response with code: ${code}`);
});
client.on('connectFailed', error => {
    console.log(`Connection failed with error: ${error}`);
});
client.on('connect', connectionMessage => {
    console.log(`Connected with message: ${connectionMessage}`);
});

// handle websocket connections
wss.on('connection', ws => {
    console.log('WebSocket connection established.');

    // begin streaming session
    var stream = client.start();

    // create event responses for the stream
    stream.on('data', data => {
        console.log(data);
    });
    stream.on('end', function () {
        console.log("End of Stream");
    });

    ws.on('message', message => {
        // assumes the message is the audio data
        // pipe the WebSocket audio to Rev AI client
        stream.write(message);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed.');
        stream.end();
    });

    ws.on('error', error => {
        console.log(`WebSocket error: ${error}`);
    });
});
