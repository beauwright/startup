const express = require('express');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Get Saved Transcripts
apiRouter.get('/transcripts', (_req, res) => {
  res.send(transcripts);
});

// Save Note
apiRouter.post('/saveNote', (req, res) => {
  notes = updateNotes(req.body, note);
});

// Get existing notes
apiRouter.get('/transcriptNotes', (_req, res)) {
  res.send(notes);
}

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Notes will eventually be saved in S3 when DB is implemented but for now they are just stored
// in memory and disappear whenever the service is restarted.
let notes = [];

function updateNotes(newNote) {
  notes.push(newNote);
}

function getNotes() {
  return notes;
}