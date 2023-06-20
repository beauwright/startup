const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');

let socket, audioContext, workletNode, stream, input;

stopButton.addEventListener("click", stopRecording);


// Handles microphone stream
function handleMicStream(streamObj) {
    stream = streamObj;
    input = audioContext.createMediaStreamSource(stream);
    workletNode = new AudioWorkletNode(audioContext, 'audio-processor');
    input.connect(workletNode);

    workletNode.port.onmessage = (event) => {
        if (event.data.type === 'micBinaryStream') {
            socket.emit('micBinaryStream', event.data.payload);
        }
    };
}

function stopRecording() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }

    closeAll();
}

function closeAll() {
    if (stream) {
        const track = stream.getTracks()[0];
        if (track) track.stop();
    }

    if (workletNode) {
        workletNode.port.close();
        workletNode.disconnect();
        workletNode = null;
    }

    if (input) {
        input.disconnect();
        input = null;
    }

    if (audioContext) {
        audioContext.close().then(() => {
            audioContext = null;
        });
    }
}

async function fetchUser() {
    try {
        const response = await fetch('/api/user/', {
            credentials: 'same-origin',  // This includes cookies in the request
        })
            .catch(response => {
                window.location.href = '/login.html';
            });

        if (response.status === 401) {
            // User is not authenticated. Redirect them to login page
            window.location.href = '/login.html';
            return null;
        }

        if (!response.ok) {
            console.error('Network response was not ok');
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);

        if (data.error) {
            console.error(data.error);
            return null;
        } else {
            console.log(data.user);
            return data;
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/login.html'; // redirect to login page
        return null;
    }
}

class Transcript {
    constructor() {
        this.title = document.getElementById('transcript-title');
        this.title.addEventListener('click', () => $('#changeTitleModal').modal('show'));
        document.getElementById('saveTitle').addEventListener('click', this.saveTitle.bind(this));
        this.user = null;
        this.userId = null;
        this.transcriptId = null;
        this.allTranscriptText = "";
    }

    async init() {
        fetchUser().then(user => {
            this.user = user;
            this.userId = this.user.id;

            console.log(this.user);
        })
            .then(r => {

                console.log(this.user);
                // Don't call createTranscript until we've fetched the user since the id is needed
                this.createTranscript();
            });
    }

    async startRecording() {
        startButton.disabled = true;
        stopButton.disabled = false;

        socket = io();
        audioContext = new AudioContext({ sampleRate: 44100});
        await audioContext.audioWorklet.addModule('audio-worklet-processor.js');

        // When a transcript is received, append it to the 'transcriptions' div
        socket.on('transcript', async function(transcript) {
            // Append the new transcript to existing ones
            if(this.allTranscriptText !== "") {
                this.allTranscriptText += "\n" + transcript;
            } else {
                this.allTranscriptText += transcript;
            }

            // Get userId and transcriptId from this Transcript instance:
            const userId = this.userId;
            const transcriptId = this.transcriptId;

            const transcriptionsDiv = document.getElementById('transcript-text');
            const p = document.createElement('p');
            p.textContent = transcript;
            transcriptionsDiv.appendChild(p);

            // Scroll the container to the bottom
            transcriptionsDiv.scrollTop = transcriptionsDiv.scrollHeight;

            // Append new transcript to server
            try {
                // TODO: FIX THIS. This is super inefficient and should be handled on the server side but this was quicker
                const response = await fetch(`/api/users/${userId}/transcripts/${transcriptId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({text: this.allTranscriptText}),
                });

                if (!response.ok) {
                    console.log(`Server response was not ok: ${response.status}`);
                }
            } catch (error) {
                console.error('Failed to update transcript on server:', error);
            }
        }.bind(this)); // Use bind(this) to access the Transcript instance inside the callback

        audioContext.resume().then(() => {
            console.log(audioContext.sampleRate);
            navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                .then(handleMicStream)
                .catch(err => alert('Error accessing microphone: ' + err.message));
        });
    }

    requestMicrophonePermissions() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(this.handleMicStream.bind(this))
            .catch(err => {
                // handle the error appropriately
                console.log('Microphone permission denied', err);
                $('#micPermissionModal .modal-body').text(`Microphone permission was denied. Microphone access is needed so your own words will also be included in the transcript.`);
                $('#micPermissionModal .modal-footer').html(`<button class="btn btn-primary" id="retryPermissions">Retry Permissions</button>
                                         <button class="btn btn-secondary" data-dismiss="modal">Close</button>`);
                document.getElementById('retryPermissions').addEventListener('click', this.requestMicrophonePermissions.bind(this));
                // Show the microphone permission modal
                $('#micPermissionModal').modal('show');
            });
    }

    setInitialTitle() {
        const date = new Date();
        this.title.textContent = `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear().toString().slice(-2)} ${date.toLocaleTimeString()} Transcript`;
    }

    async createTranscript() {
        try {
            const makeTranscriptDetails = {
                title: this.title.textContent,
                text: "",
                userId: this.userId,
            }
            console.log(this.userId);
            console.log("make transcript details: ", makeTranscriptDetails);
            const response = await fetch(`/api/users/${this.userId}/transcript`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(makeTranscriptDetails),
            });

            const data = await response.json();
            console.log(this.transcriptId);
            this.transcriptId = data.transcript.id;
            console.log(data);
        } catch (err) {
            console.error('Error:', err);
        }
    }

    async saveTitle() {
        const newTitle = document.getElementById('newTitle').value;
        if (newTitle.trim() !== '') {
            this.title.textContent = newTitle;
            console.log("new title is: " + newTitle);
            $('#changeTitleModal').modal('hide');
            // Update the title on the server
            const response = await fetch(`/api/users/${this.userId}/transcripts/${this.transcriptId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title: newTitle}),
            });
            if (!response.ok) {
                console.log('Title update failed');
            }
        }
    }
}

class Notes {
    constructor(transcript) {
        this.transcript = transcript;
        this.container = document.getElementById('existing-notes');
        document.getElementById('save-note').addEventListener('click', this.saveNote.bind(this));
        document.getElementById('stop').addEventListener('click', this.endTranscript.bind(this));
    }

    saveNote() {
        const newNote = document.getElementById('new-note').value;
        if (newNote.trim() !== '') {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note-item');

            const noteTime = new Date().toLocaleTimeString();

            // Store both note and time in the element's innerHTML
            noteElement.innerHTML = `<span class="note-time">${noteTime}</span> ${newNote}`;

            this.container.appendChild(noteElement);
            document.getElementById('new-note').value = '';
            this.container.style.display = 'block';

            // Scroll the container to the bottom
            this.container.scrollTop = this.container.scrollHeight;

            // Send the note to the server
            this.sendNoteToServer(newNote, noteTime);
        }
    }

    async sendNoteToServer(note, timestamp) {
        try {
            const response = await fetch(`/api/users/${this.transcript.userId}/transcripts/${this.transcript.transcriptId}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    noteText: note,
                    date: timestamp
                })
            });

            const data = await response.json();
            // Use data.id as needed
        } catch (err) {
            console.error('Error:', err);
        }
    }
    endTranscript() {
        window.location.href = 'dashboard.html';
    }
}

async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        // Redirect to the login page on successful logout
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Error:', error);
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    const transcript = new Transcript();
    new Notes(transcript);
    transcript.setInitialTitle();
    transcript.init();
    document.getElementById('logout-button').addEventListener('click', logout);

    // Add the event listeners here and bind them to the transcript instance
    startButton.addEventListener("click", transcript.startRecording.bind(transcript));
    stopButton.addEventListener("click", stopRecording);
});