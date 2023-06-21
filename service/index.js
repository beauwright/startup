const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const database = require('./database.js');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const socketIO = require('socket.io');
const revai = require('revai-node-sdk');
const config = require('./dbConfig.json');

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));


server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('User connected');
  let rev_connection = null;
  let audioStream = null;

  socket.on('micBinaryStream', async (streamData) => {
    // Assuming 'streamData' contains audio binary data
    if (!audioStream) {
      rev_connection = new revai.RevAiStreamingClient(config.revAIToken, new revai.AudioConfig(
          /* contentType */ "audio/x-raw",
          /* layout */      "non-interleaved",
          /* sample rate */ 44100,
          /* format */      "S16LE",
          /* channels */    1,
      ));
      const sessionConfig = new revai.SessionConfig(null, null, null, null, null, null, null, null, null, false, true);
      audioStream = rev_connection.start(sessionConfig);

      audioStream.on('data', (data) => {
        if (data.type === 'final') {
          const transcript = data.elements.map(element => element.value).join('');
          socket.emit('transcript', transcript);
        }
      });

      // Handle errors during transcription
      audioStream.on('error', (err) => {
        console.error('Error during transcription:', err);
        socket.emit('error', { error: 'Error during transcription' });
        socket.disconnect();

      });
    }

    // Check if the data is binary before writing to the stream
    if (Buffer.isBuffer(streamData)) {
      audioStream.write(streamData);
    } else {
      console.error('Received non-binary data');
      socket.emit('error', { error: 'Expected binary audio data' });
      socket.disconnect();
    }
  });

  socket.on('disconnect', () => {
    if (audioStream) {
      try {
        console.log('Closing audioStream...');
        rev_connection.end();
      } catch (error) {
        console.error('Error when ending the audio stream:', error);
      } finally {
        audioStream = null;
      }
    }
    console.log('User disconnected');
  });
});

const authCookieName = 'token';
const apiRouter = express.Router();
const secureApiRouter = express.Router();
app.use(`/api`, apiRouter);
app.use(`/api`, secureApiRouter);

// Create a user
apiRouter.post('/auth/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).send({ message: 'Email, password, first name and last name are required' });
  }

  // check for existing user
  const existingUser = await database.getUserByEmail(email);
  if (existingUser) {
    return res.status(409).send({ message: 'Email is already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = uuidv4();

  const user = await database.createUser(email, hashedPassword, firstName, lastName, token, uuidv4());
  res.cookie(authCookieName, token, { secure: true, httpOnly: true, sameSite: 'strict' });
  res.status(201).send({ message: 'User created successfully', user });
});

// Authenticate a user
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await database.getUserByEmail(email);
  if (user && await bcrypt.compare(password, user.hashedPassword)) {
    // Update the isActive field when user logs in
    await database.updateUserIsActive(user.id, true);
    res.cookie(authCookieName, user.authToken, { secure: true, httpOnly: true, sameSite: 'strict' });
    res.send({ message: 'User authenticated', user });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

// Logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const authToken = req.cookies[authCookieName];
  const user = await database.getUserByToken(authToken);
  if (!user) {
    return res.status(401).send({ message: 'Not authenticated' });
  }

  // Set the isActive field to false
  await database.updateUserIsActive(user.id, false);

  // Generate a new token and update the user in the database
  const newToken = uuidv4();
  await database.updateUserToken(user.id, newToken);

  res.clearCookie(authCookieName);
  res.status(204).end();
});


// Check auth
secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await database.getUserByToken(authToken);
  if (user && user.isActive) {  // Check that the session is active
    req.user = user;
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
});


// Get the authenticated user's data
secureApiRouter.get('/user', (req, res) => {
  // Remove the hashed password and authToken from the response for security reasons
  const { hashedPassword, authToken, ...user } = req.user;
  res.send(user);
});


secureApiRouter.post('/users/:userId/transcript', async (req, res) => {
  const id = req.params.userId;
  const transcript = req.body;

  if (!transcript.title) {
    return res.status(400).send({ message: 'Missing required transcript field: title' });
  }

  const transcriptUser = await database.getUserById(id);
  if (!transcriptUser) {
    res.status(404).send({ message: 'User not found' });
  }
  const newTranscript = {
    'id': uuidv4(),
    'userId': id,
    'title': transcript.title,
    'text': transcript.text.toString(),
    'date': transcript.date || new Date().toUTCString(),
    'notes': []
  };

  console.log(newTranscript);

  const user = await database.getUserById(id);

  if (!user) {
    return res.status(400).send({ message: 'Invalid user credentials' });
  } else {
    await database.addTranscript(newTranscript);
  }

  res.status(201).send({ message: 'Transcript created successfully', transcript: newTranscript });
});

secureApiRouter.get('/users/:userId/transcripts', async (req, res) => {
  const userId = req.params.userId;
//  console.log(userId);
  // Check if the authenticated user's ID matches the requested user's ID
//  if (userId !== req.user.userId) {
//    return res.status(403).send({ message: 'Forbidden' });
//  }

  const transcripts = await database.getUserTranscripts(userId);
  res.send(transcripts);
});


// Get Transcript's Notes
secureApiRouter.get('/users/:userId/transcripts/:transcriptId/notes', async (req, res) => {
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
secureApiRouter.post('/users/:userId/transcripts/:transcriptId/notes', async (req, res) => {
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
secureApiRouter.get('/users/:userId/transcripts/:transcriptId/settings', async (req, res) => {
  const transcriptId = req.params.transcriptId;

  const transcript = await database.getTranscriptById(transcriptId);

  if (!transcript) {
    res.status(404).send({ message: 'Transcript not found' });
  } else {
    const settings = await database.getTranscriptSettings(transcriptId) || { "notificationWords": [], "dictionaryWords": []};
    res.json(settings);
  }
});

// Update Transcript's Title
secureApiRouter.patch('/users/:userId/transcripts/:transcriptId', async (req, res) => {
  const transcriptId = req.params.transcriptId;
  const newTitle = req.body.title;
  const newText = req.body.text;  // Get the new text from the request body

  // Check if the new title or new text are provided
  if (!newTitle && !newText) {
    return res.status(400).send({ message: 'New title or new text is required' });
  }

  const transcript = await database.getTranscriptById(transcriptId);

  if (!transcript) {
    res.status(404).send({ message: 'Transcript not found' });
  } else {
    const updatedFields = {};  // Object to hold fields to be updated
    if (newTitle) updatedFields.title = newTitle;
    if (newText) updatedFields.text = newText;  // Add the new text to the fields to be updated

    await database.updateTranscript(transcriptId, updatedFields);
    const updatedTranscript = await database.getTranscriptById(transcriptId);
    res.send({ message: 'Transcript updated successfully', transcript: updatedTranscript });
  }
});

// Update Transcript's Settings
secureApiRouter.put('/users/:userId/transcripts/:transcriptId/settings', async (req, res) => {
  const userId = req.params.userId;
  const transcriptId = req.params.transcriptId;
  const newSettings = req.body;

  const user = await database.getUserByEmail(userId);
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