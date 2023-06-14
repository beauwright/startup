const express = require('express');
const {
  v4 : uuidv4,
  parse:uuidParse,
  stringify : uuidStringify
} = require('uuid')
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

// Create a new transcript
apiRouter.post('/users/:userId/transcript', (req, res) => {
  const userId = req.params.userId;
  const transcript = req.body;

  // Basic validation 
  if (!transcript.title) {
    return res.status(400).send({ message: 'Missing required transcript fields: id and title' });
  }

  // Create the new transcript with an empty 'notes' object.
  const newTranscript = {
    'id': uuidv4(),
    'title': transcript.title,
    'text': transcript.text.toString(),
    'date': transcript.date || new Date().toUTCString(),
    'notes': {
    },
  };
  console.log(newTranscript);

  // Verify user exists, after login is implemented, check user is logged in
  if (!(userId in users)) {
    return res.status(400).send({ message: 'Invalid user credentials' });
  } else {
    // Add the new transcript to the user's list of transcripts
    users[userId].transcripts[newTranscript.id] = newTranscript;
  }

  // Send a success response
  res.status(201).send({ message: 'Transcript created successfully', transcript: newTranscript });
});

// Get User's Transcripts
apiRouter.get('/users/:userId/transcripts', (req, res) => {
  const userId = req.params.userId;
  if (userId in users) {
    res.send(Object.values(users[userId].transcripts));
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

// Get Transcript's Notes
apiRouter.get('/users/:userId/transcripts/:transcriptId/notes', (req, res) => {
  const userId = req.params.userId;
  const transcriptId = req.params.transcriptId;
  if (userId in users && transcriptId in users[userId].transcripts) {
    res.send(Object.values(users[userId].transcripts[transcriptId].notes));
  } else {
    res.status(404).send({ message: 'Transcript not found' });
  }
});

// Save Note
apiRouter.post('/users/:userId/transcripts/:transcriptId/notes', (req, res) => {
  const userId = req.params.userId;
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

  // Check if the user and transcript exist
  if (userId in users && transcriptId in users[userId].transcripts) {
    users[userId].transcripts[transcriptId].notes[newNote.id] = newNote;
    res.send({ message: 'Note added successfully', note: newNote });
  } else {
    res.status(404).send({ message: 'Transcript not found' });
  }
});

apiRouter.get('/users/:userId/transcripts/:transcriptId/settings', (req, res) => {
  const userId = req.params.userId;
  const transcriptId = req.params.transcriptId;

  if (userId in users && transcriptId in users[userId].transcripts) {
    let settings = {
      notificationWords: users[userId].transcripts[transcriptId].notificationWords || [],
      dictionaryWords: users[userId].transcripts[transcriptId].dictionaryWords || [],
    }
    console.log("Transcript settings have been loaded.");
    console.log(settings);
    res.json(settings);
  } else {
    res.status(404).send({ message: 'Transcript not found' });
  }
});


apiRouter.patch('/users/:userId/transcripts/:transcriptId', (req, res) => {
  const userId = req.params.userId;
  const transcriptId = req.params.transcriptId;
  const newTitle = req.body.title;

  if (!newTitle) {
    return res.status(400).send({ message: 'New title is required' });
  }

  // Check if the user and transcript exist
  if (userId in users && transcriptId in users[userId].transcripts) {
    // Update the title
    users[userId].transcripts[transcriptId].title = newTitle;

    res.send({ message: 'Transcript title updated successfully', transcript: users[userId].transcripts[transcriptId] });
  } else {
    res.status(404).send({ message: 'User or transcript not found' });
  }
});

apiRouter.get('/users/:userId/transcripts/:transcriptId/settings', (req, res) => {
  const userId = req.params.userId;
  const transcriptId = req.params.transcriptId;

  if (userId in users && transcriptId in users[userId].transcripts) {
    let settings = {
      notificationWords: users[userId].transcripts[transcriptId].notificationWords || [],
      dictionaryWords: users[userId].transcripts[transcriptId].dictionaryWords || [],
    }
    console.log("Transcript settings have been loaded.");
    console.log(settings);
    res.json(settings);
  } else {
    res.status(404).send({ message: 'Transcript not found' });
  }
});


apiRouter.put('/users/:userId/transcripts/:transcriptId/settings', (req, res) => {
  const userId = req.params.userId;
  const transcriptId = req.params.transcriptId;

  if (userId in users && transcriptId in users[userId].transcripts) {
    if (req.body.notificationWords) {
      users[userId].transcripts[transcriptId].notificationWords = req.body.notificationWords;
    }
    if (req.body.dictionaryWords) {
      users[userId].transcripts[transcriptId].dictionaryWords = req.body.dictionaryWords;
    }
    console.log("Transcript settings have been updated.");
    console.log(users[userId].transcripts[transcriptId]);
    res.json({ message: 'Transcript updated successfully' });
  } else {
    res.status(404).send({ message: 'Transcript not found' });
  }
});



// Handle API calls to bad endpoints
app.use("/api/*", (_req, res) => {
  res.status(404).send({ message: "API endpoint not found" });
});


// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// This is just a very basic placeholder until login and DB are implemented
let users = {
  'johnDoe': {
    'password': 'a_really_cool_password',
    'transcripts': {
      'transcript1': {
        'id': 'transcript1',
        'title': 'A very cool transcript',
        'text': 'Transcript text here',
        'date': '2023-06-01',
        'notes': {
          'note1': {
            'id': 'note1',
            'date': '2023-06-01',
            'text': 'Some note here'
          },
          'note2': {
            'id': 'note2',
            'date': '2023-06-01',
            'text': 'Another note here'
          }
        }
      },
      'transcript2': {
        'id': 'transcript2',
        'title': 'Another very cool transcript',
        'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nec feugiat nisl pretium fusce id velit ut tortor. Ac tortor dignissim convallis aenean et tortor at risus. Tellus molestie nunc non blandit massa enim nec. Orci nulla pellentesque dignissim enim sit. Habitasse platea dictumst vestibulum rhoncus est. At auctor urna nunc id cursus metus. Tincidunt dui ut ornare lectus sit amet est placerat. Urna nec tincidunt praesent semper feugiat. Sapien et ligula ullamcorper malesuada proin libero. Eget lorem dolor sed viverra ipsum nunc. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a. Et pharetra pharetra massa massa ultricies mi quis hendrerit. Fames ac turpis egestas sed tempus urna. Nisi est sit amet facilisis magna. Curabitur gravida arcu ac tortor dignissim convallis aenean. Ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt. Tortor pretium viverra suspendisse potenti nullam ac tortor vitae. Tellus molestie nunc non blandit massa enim nec. Urna condimentum mattis pellentesque id. In massa tempor nec feugiat nisl pretium fusce id velit. Nisi lacus sed viverra tellus in hac habitasse. Ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit. Tellus molestie nunc non blandit massa enim nec dui nunc. Nascetur ridiculus mus mauris vitae ultricies leo integer malesuada nunc. Ac tortor dignissim convallis aenean et tortor. Curabitur gravida arcu ac tortor dignissim convallis aenean. Maecenas accumsan lacus vel facilisis volutpat est. Cursus metus aliquam eleifend mi in. Molestie a iaculis at erat pellentesque adipiscing commodo elit. Turpis egestas integer eget aliquet nibh praesent tristique magna. Sed enim ut sem viverra aliquet. Quis blandit turpis cursus in hac habitasse platea dictumst. Interdum posuere lorem ipsum dolor sit amet consectetur. Porttitor eget dolor morbi non arcu risus quis. Gravida in fermentum et sollicitudin ac orci phasellus egestas. Velit egestas dui id ornare arcu odio ut sem nulla. Vestibulum lectus mauris ultrices eros in cursus turpis. Gravida cum sociis natoque penatibus et magnis dis parturient montes. Magna fermentum iaculis eu non diam. Risus nec feugiat in fermentum posuere urna. Tempus quam pellentesque nec nam aliquam sem et. Cursus in hac habitasse platea. Nisi est sit amet facilisis. Amet cursus sit amet dictum sit amet justo donec enim. Sed felis eget velit aliquet sagittis id consectetur. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Quis ipsum suspendisse ultrices gravida dictum. Magna fringilla urna porttitor rhoncus dolor purus non enim praesent. Tempor orci dapibus ultrices in iaculis nunc sed. Metus dictum at tempor commodo ullamcorper a lacus. Aenean et tortor at risus. Sit amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Vulputate mi sit amet mauris. Tortor aliquam nulla facilisi cras fermentum odio. Porta non pulvinar neque laoreet suspendisse interdum. Integer malesuada nunc vel risus. Faucibus vitae aliquet nec ullamcorper sit. Dui sapien eget mi proin sed. Mauris cursus mattis molestie a iaculis at erat. Quis lectus nulla at volutpat diam ut venenatis tellus. In metus vulputate eu scelerisque felis imperdiet proin. Non enim praesent elementum facilisis leo. Lectus mauris ultrices eros in. Netus et malesuada fames ac. Diam sollicitudin tempor id eu nisl nunc mi ipsum. Phasellus vestibulum lorem sed risus ultricies tristique.',
        'date': '2023-06-01',
        'notes': {
          'note1': {
            'id': 'note1',
            'date': '2023-06-01',
            'text': 'Some note here'
          },
          'note2': {
            'id': 'note2',
            'date': '2023-06-01',
            'text': 'Another note here'
          }
        }
      }
    }
  }
}