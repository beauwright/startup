const { MongoClient, ObjectId } = require('mongodb');
const config = require('./dbConfig.json');
const bcrypt = require('bcrypt');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('callsidekick');
const usersCollection = db.collection('users');
const transcriptsCollection = db.collection('transcripts');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});


async function createUser(email, hashedPassword, firstName, lastName, authToken, id) {
    const user = { email, hashedPassword, firstName, lastName, authToken, id, isActive: true };
    const result = await usersCollection.insertOne(user);
    // Get the inserted document based on the insertedId
    return await usersCollection.findOne({ _id: result.insertedId });
}


async function verifyUserCredentials(email, hashedPassword) {
    const user = await usersCollection.findOne({ email });
    // Use bcrypt to compare the hashed passwords
    return user && await bcrypt.compare(hashedPassword, user.hashedPassword);
}

async function getUserByToken(authToken) {
    return await usersCollection.findOne({ authToken, isActive: true });
}


async function addTranscript(transcript) {
    const result = await transcriptsCollection.insertOne(transcript);
    return result;
}

async function getUserTranscripts(userId) {
    const transcripts = await transcriptsCollection.find({ userId: userId }).toArray();
    return transcripts;
}

async function getUserById(userId) {
    const user = await usersCollection.findOne({ id: userId });
    return user;
}

async function getTranscriptById(transcriptId) {
    // Convert transcriptId to ObjectId and find the document in the database
    const transcript = await transcriptsCollection.findOne({ id: transcriptId });
    return transcript;
}

async function getTranscriptNotes(transcriptId) {
    // Assuming that the notes are stored in a notes field in the transcript document
    const transcript = await transcriptsCollection.findOne({ id: transcriptId });
    return transcript ? transcript.notes : null;
}

async function addNoteToTranscript(transcriptId, newNote) {
    // Add newNote to the notes field of the transcript document
    const result = await transcriptsCollection.updateOne(
        { id: transcriptId },
        { $push: { notes: newNote } }
    );
    return result;
}

async function getTranscriptSettings(transcriptId) {
    // Assuming that the settings are stored in a settings field in the transcript document
    const transcript = await transcriptsCollection.findOne({ id: transcriptId });
    return transcript ? transcript.settings : null;
}

async function updateTranscript(transcriptId, update) {
    // Update the transcript document with the new values provided in the update object
    const result = await transcriptsCollection.updateOne(
        { id: transcriptId },
        { $set: update }
    );
    return result;
}

async function updateTranscriptSettings(transcriptId, newSettings) {
    // Update the settings field in the transcript document with newSettings
    const result = await transcriptsCollection.updateOne(
        { id: transcriptId },
        { $set: { settings: newSettings } }
    );
    return result;
}

async function createTestUser() {
    const testUser = {
        email: 'johnDoe',
        userId: "648b79f541c521eb84022be8",
        email: 'johnDoe@test.com',
        password: 'testPassword'
    };

    const result = await usersCollection.insertOne(testUser);
    return result;
}

// Example to show the data structure
let transcriptData = {
    'id': "notarealuuid2",
    'userId': "648b79f541c521eb84022be8", // Associate the transcript with the user
    'title': "Sample Transcript Title",
    'text': "Sample Transcript Text",
    'date': new Date().toUTCString(),
    'notes': [{date: new Date().toUTCString(), text: "much wow"}]
};

// You'd add the transcript in your database
//addTranscript(transcriptData).catch(console.error);



// Call the function to create the test user
//createTestUser().catch(console.error);
//createTestNote().catch(console.error);


async function getUserByEmail(email) {
    console.log(email);
    return usersCollection.findOne({ email: email });
}

async function updateUserToken(id, newToken) {
    // Assuming you have a "users" collection in your database
    const user = await usersCollection.updateOne(
        { id },
        { $set: { authToken: newToken, isActive: false } }
    );
    return user;
}


async function updateUserIsActive(id, isActive) {
    // Assuming you have a "users" collection in your database
    const user = await usersCollection.updateOne(
        { id },
        { $set: { isActive: isActive } }
    );
    return user;
}



module.exports = {
    addTranscript,
    getUserTranscripts,
    getUserById,
    getTranscriptById,
    getTranscriptNotes,
    addNoteToTranscript,
    getTranscriptSettings,
    updateTranscript,
    updateTranscriptSettings,
    getUserByEmail,
    createUser,
    verifyUserCredentials,
    getUserByToken,
    updateUserToken,
    updateUserIsActive
};

