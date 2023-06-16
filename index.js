const express = require('express');
const { v4: uuidv4 } = require('uuid');
const database = require('./database');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/users/:username/transcript', async (req, res) => {
  const username = req.params.username;
  const transcript = req.body;

  if (!transcript.title) {
    return res.status(400).send({ message: 'Missing required transcript field: title' });
  }

  const transcriptUser = await database.getUserByUsername(username);
  if (!transcriptUser) {
    res.status(404).send({ message: 'User not found' });
  }
  const newTranscript = {
    'id': uuidv4(),
    'userId': transcriptUser.userId,  // Associate the transcript with the user
    'title': transcript.title,
    'text': transcript.text.toString(),
    'date': transcript.date || new Date().toUTCString(),
    'notes': []
  };

  console.log(newTranscript);

  const user = await database.getUserByUsername(username);

  if (!user) {
    return res.status(400).send({ message: 'Invalid user credentials' });
  } else {
    await database.addTranscript(newTranscript);
  }

  res.status(201).send({ message: 'Transcript created successfully', transcript: newTranscript });
});

apiRouter.get('/users/:username/transcripts', async (req, res) => {
  const username = req.params.username;

  const user = await database.getUserByUsername(username);
  console.log(user);
  if (!user) {
    res.status(404).send({ message: 'User not found' });
  } else {
    const transcripts = await database.getUserTranscripts(user.userId);
    console.log(transcripts);
    res.send(transcripts);
  }
});

// Get Transcript's Notes
apiRouter.get('/users/:userId/transcripts/:transcriptId/notes', async (req, res) => {
  const transcriptId = req.params.transcriptId;
  console.log(transcriptId)
  const transcript = await database.getTranscriptById(transcriptId);

  if (!transcript) {
    res.status(404).send({ message: 'Transcript not found' });
  } else {
    const notes = await database.getTranscriptNotes(transcriptId);
    res.send(notes);
  }
});

// Save Note
apiRouter.post('/users/:userId/transcripts/:transcriptId/notes', async (req, res) => {
  const transcriptId = req.params.transcriptId;
  const noteText = req.body.noteText;
  const date = req.body.date;

  if (!noteText) {
    return res.status(400).send({ message: 'Note text is required' });
  }

  const newNote = {
    id: uuidv4(),
    date: date,
    text: noteText,
  };

  const transcript = await database.getTranscriptById(transcriptId);

  if (!transcript) {
    res.status(404).send({ message: 'Transcript not found' });
  } else {
    await database.addNoteToTranscript(transcriptId, newNote);
    res.send({ message: 'Note added successfully', note: newNote });
  }
});

// Get Transcript's Settings
apiRouter.get('/users/:userId/transcripts/:transcriptId/settings', async (req, res) => {
  const transcriptId = req.params.transcriptId;

  const transcript = await database.getTranscriptById(transcriptId);

  if (!transcript) {
    res.status(404).send({ message: 'Transcript not found' });
  } else {
    const settings = await database.getTranscriptSettings(transcriptId);
    res.json(settings);
  }
});

// Update Transcript's Title
apiRouter.patch('/users/:userId/transcripts/:transcriptId', async (req, res) => {
  const transcriptId = req.params.transcriptId;
  const newTitle = req.body.title;

  if (!newTitle) {
    return res.status(400).send({ message: 'New title is required' });
  }

  const transcript = await database.getTranscriptById(transcriptId);

  if (!transcript) {
    res.status(404).send({ message: 'Transcript not found' });
  } else {
    await database.updateTranscript(transcriptId, { title: newTitle });
    const updatedTranscript = await database.getTranscriptById(transcriptId);
    res.send({ message: 'Transcript title updated successfully', transcript: updatedTranscript });
  }
});

// Update Transcript's Settings
apiRouter.put('/users/:userId/transcripts/:transcriptId/settings', async (req, res) => {
  const userId = req.params.userId;
  const transcriptId = req.params.transcriptId;
  const newSettings = req.body;

  const user = await database.getUserByUsername(userId);
  const transcript = user ? await database.getTranscriptById(transcriptId) : null;

  if (!user || !transcript) {
    return res.status(404).send({ message: 'Transcript not found' });
  }

  const updatedSettings = await database.updateTranscriptSettings(transcriptId, newSettings);

  res.send({ message: 'Transcript settings updated successfully', settings: updatedSettings });
});

app.use("/api/*", (_req, res) => {
  res.status(404).send({ message: "API endpoint not found" });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});