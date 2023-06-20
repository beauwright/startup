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

        fetchUser().then(user => {
            if (!user) {
                return; // Stop execution if user is not logged in
            }

            this.user = user;
            this.userId = this.user.id;

            // The hard coded name will be replaced with value called from server
            this.notificationWords = [];
            this.dictionaryWords = [];
            this.setupModalListeners();
            this.initEnvironmentCheck();
            this.setupScreenShare();
            console.log(this.user);
            this.transcriptId = null;

            // create a new AudioContext
            this.audioContext = null;
            this.socket = io();
        });
    }

    async init() {
        // create a new AudioContext after user action
        this.audioContext = new window.AudioContext();
        this.processor = this.audioContext.createScriptProcessor(16384, 1, 1);
    }
    initEnvironmentCheck() {
        let browser, os;
        const userAgent = navigator.userAgent;

        if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
            browser = "Chrome";
        } else if (userAgent.includes("Edg")) {
            browser = "Edge";
        }

        if (navigator.platform.includes("Win")) {
            os = "Windows";
        } else if (navigator.platform.includes("Mac")) {
            os = "MacOS";
        } else if (navigator.platform.includes("Linux")) {
            os = "Linux";
        }

        // Show the modal with appropriate message
        if (browser === "Chrome" || browser === "Edge") {
            if (os === "Windows" || os === "ChromeOS") {
                // User should screen share their audio
                $('#initCheckModal .modal-body').text(`Screen sharing is used to analyze the audio of your call. Ensure the "share desktop audio" box is checked so Call Sidekick can analyze the audio of your call.`);
                $('#initCheckModal .modal-footer').html(`<button id="startScreenShare" class="btn btn-primary">Start Screen Share</button>
                                                         <button id="bypassScreenShare" class="btn btn-secondary">Bypass Screen Share</button>`);
            } else if (os === "MacOS" || os === "Linux") {
                // User should screen share their audio and use web version of their video call service
                $('#initCheckModal .modal-body').text(`${browser} currently only supports audio capture of other ${browser} tabs on ${os}. Most video call platforms like Zoom, Google Meet, and Discord have web versions. Open your video call in your web browser, screen share that tab with the "share tab audio" box checked, and navigate back to this tab so Call Sidekick can analyze the audio of your call.`);
                $('#initCheckModal .modal-footer').html(`<button id="startScreenShare" class="btn btn-primary">Start Screen Share</button>
                                                         <button id="bypassScreenShare" class="btn btn-secondary">Bypass Screen Share</button>`);
            }
        } else {
            // Browser not supported
            $('#initCheckModal .modal-body').text(`You are using an unsupported browser. Only Chrome and Edge are currently supported.`);
            $('#initCheckModal .modal-footer').html(`<button class="btn btn-secondary" data-dismiss="modal">Close</button>`);
        }

        $('#initCheckModal').modal('show');
    }

    setupScreenShare() {
        document.getElementById('startScreenShare').addEventListener('click', this.startScreenShare.bind(this));
        document.getElementById('startScreenShare').addEventListener('click', this.init.bind(this));
        document.getElementById('bypassScreenShare').addEventListener('click', this.bypassScreenShare.bind(this));
        document.getElementById('bypassScreenShare').addEventListener('click', this.init.bind(this));

    }

    async startScreenShare() {
        try {
            const displayMediaOptions = {
                video: {
                    cursor: "always"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 41000
                }
            };

            const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
            this.videoStream = stream;

            // connect the screenshare audio to the AudioContext
            const videoSource = this.audioContext.createMediaStreamSource(this.videoStream);
            this.videoGainNode = this.audioContext.createGain();
            videoSource.connect(this.videoGainNode);

            // initiate microphone permissions
            $('#initCheckModal').modal('hide');
            this.requestMicrophonePermissions();
        } catch(err) {
            console.error("Error: " + err);
        }
    }
    bypassScreenShare() {
        // Close the initial check modal
        $('#initCheckModal').modal('hide');
        // Open a new modal for microphone permissions
        this.requestMicrophonePermissions();
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

    handleMicStream(streamObj) {
        this.stream = streamObj;
        this.input = this.audioContext.createMediaStreamSource(this.stream);
        this.input.connect(this.processor);
        this.processor.onaudioprocess = e => {
            this.microphoneProcess(e);
        };
    }

    microphoneProcess(e) {
        const left = e.inputBuffer.getChannelData(0);
        const left16 = this.convertFloat32ToInt16(left);
        this.socket.emit('micBinaryStream', left16);
    }

    convertFloat32ToInt16(buffer) {
        let l = buffer.length;
        const buf = new Int16Array(l / 3);
        while (l--) {
            if (l % 3 === 0) {
                buf[l / 3] = buffer[l] * 0xFFFF;
            }
        }
        return buf.buffer;
    }

    closeAll() {
        const tracks = this.stream ? this.stream.getTracks() : null;
        const track = tracks ? tracks[0] : null;
        if (track) {
            track.stop();
        }
        if (this.processor) {
            if (this.input) {
                try {
                    this.input.disconnect(this.processor);
                } catch (error) {
                    console.warn('Attempt to disconnect input failed.');
                }
            }
            this.processor.disconnect(this.audioContext.destination);
        }
        if (this.audioContext) {
            this.audioContext.close().then(() => {
                this.input = null;
                this.processor = null;
                this.audioContext = null;
            });
        }
    }
    setInitialTitle() {
        const date = new Date();
        this.title.textContent = `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear().toString().slice(-2)} ${date.toLocaleTimeString()} Transcript`;
    }

    async createTranscript() {
        try {
            const makeTranscriptDetails = {
                title: this.title.textContent || "Untitled Transcript",
                text: "placeholder text until websocket is implemented",
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
                body: JSON.stringify({ title: newTitle }),
            });
            if (!response.ok) {
                console.log('Title update failed');
            }
        }
    }

    async loadSettings() {
        try {
            const response = await fetch(`/api/users/${this.userId}/transcripts/${this.transcriptId}/settings`);
            const data = await response.json();
            this.notificationWords = data.notificationWords || [];
            this.dictionaryWords = data.dictionaryWords || [];
        } catch (err) {
            console.error('Error:', err);
        }
    }

    async saveSettings() {
        const settings = {
            notificationWords: this.notificationWords,
            dictionaryWords: this.dictionaryWords,
        };
        try {
            await fetch(`/api/users/${this.userId}/transcripts/${this.transcriptId}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });
        } catch (err) {
            console.error('Error:', err);
        }
    }

    setupModalListeners() {
        $('#transcriptSettingsModal')
            .on('show.bs.modal', this.populateModal.bind(this))
            .on('hide.bs.modal', this.saveSettings.bind(this)); // Save the settings when the modal is closed
    }


    populateModal() {
        const containers = {
            notification: document.getElementById('notificationWordsContainer'),
            dictionary: document.getElementById('dictionaryWordsContainer')
        };

        containers.notification.innerHTML = '';
        containers.dictionary.innerHTML = '';

        const addButtons = {
            notification: document.getElementById('addNotificationWord'),
            dictionary: document.getElementById('addDictionaryWord')
        };

        const newWordInputs = {
            notification: document.getElementById('newNotificationWord'),
            dictionary: document.getElementById('newDictionaryWord')
        };

        this.addWordListeners(addButtons, newWordInputs, containers);
        this.populateWordContainers(containers);
    }

    addWordListeners(addButtons, newWordInputs, containers) {
        addButtons.notification.addEventListener('click', () => this.addNewWord(newWordInputs.notification, this.notificationWords, containers.notification));
        addButtons.dictionary.addEventListener('click', () => this.addNewWord(newWordInputs.dictionary, this.dictionaryWords, containers.dictionary));
    }

    addNewWord(newWordInput, wordArray, container) {
        const newWord = newWordInput.value;
        if (newWord !== '' && !wordArray.includes(newWord)) {
            wordArray.push(newWord);
            this.addWord(newWord, container, wordArray);
            newWordInput.value = '';
        }
    }

    addWord(word, container, wordArray) {
        const wordElement = document.createElement('div');
        wordElement.classList.add('mb-2', 'd-flex', 'justify-content-between', 'align-items-center');
        wordElement.innerHTML = `
            <span>${word}</span>
            <button class="btn btn-danger">Remove</button>
        `;
        wordElement.querySelector('button').addEventListener('click', () => this.removeWord(word, wordElement, wordArray));
        container.appendChild(wordElement);
    }

    removeWord(word, wordElement, wordArray) {
        const index = wordArray.indexOf(word);
        if (index > -1) {
            wordArray.splice(index, 1);
        }
        wordElement.remove();
    }

    populateWordContainers(containers) {
        for (const word of this.notificationWords) {
            this.addWord(word, containers.notification, this.notificationWords);
        }
        for (const word of this.dictionaryWords) {
            this.addWord(word, containers.dictionary, this.dictionaryWords);
        }
    }

    initiateTranscript() {
        console.log('Initiate transcript');
    }
}

class Notes {
    constructor(transcript) {
        this.transcript = transcript;
        this.container = document.getElementById('existing-notes');
        document.getElementById('save-note').addEventListener('click', this.saveNote.bind(this));
        document.getElementById('end-transcript').addEventListener('click', this.endTranscript.bind(this));
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
    document.getElementById('logout-button').addEventListener('click', logout);
});