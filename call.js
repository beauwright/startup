class Transcript {
    constructor() {
        this.title = document.getElementById('transcript-title');
        this.title.addEventListener('click', () => $('#changeTitleModal').modal('show'));
        document.getElementById('saveTitle').addEventListener('click', this.saveTitle.bind(this));

        this.notificationWords = ['Hank'];
        this.dictionaryWords = [];
        this.setupModalListeners();
        this.initEnvironmentCheck();
        this.setupScreenShare();
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
                $('#initCheckModal .modal-body').text(`${browser} currently only supports audio capture of other ${browser} tabs on ${os}. Most video call platforms like Zoom, Google Meet, and Discord have web versions. Open your video call in your web browser and screen share that tab with the "share tab audio" box checked so Call Sidekick can analyze the audio of your call.`);
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
        document.getElementById('bypassScreenShare').addEventListener('click', this.bypassScreenShare.bind(this));
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
                    sampleRate: 44100
                }
            };

            const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
            // Handle the audio stream for further use (e.g., sending it to the server)
            $('#initCheckModal').modal('hide');
            // Request microphone permissions after closing the screen share modal
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
            .then(stream => {
                this.audioStream = stream;
                this.initiateTranscript();
                $('#micPermissionModal').modal('hide');
            })
            .catch(err => {
                // Handling the error appropriately.
                console.log('Microphone permission denied', err);
                $('#micPermissionModal .modal-body').text(`Microphone permission was denied. Please, allow access to continue.`);
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

    saveTitle() {
        const newTitle = document.getElementById('newTitle').value;
        if (newTitle.trim() !== '') {
            this.title.textContent = newTitle;
            $('#changeTitleModal').modal('hide');
        }
    }

    setupModalListeners() {
        $('#transcriptSettingsModal').on('show.bs.modal', this.populateModal.bind(this));
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
        // Additional code here...
    }
}

class Notes {
    constructor() {
        this.container = document.getElementById('existing-notes');
        document.getElementById('save-note').addEventListener('click', this.saveNote.bind(this));
        document.getElementById('end-transcript').addEventListener('click', this.endTranscript.bind(this));
    }

    saveNote() {
        const newNote = document.getElementById('new-note').value;
        if (newNote.trim() !== '') {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note-item');

            const noteTime = new Date();
            const noteTimeString = noteTime.toLocaleTimeString();

            // Store both note and time in the element's innerHTML
            noteElement.innerHTML = `<span class="note-time">${noteTimeString}</span> ${newNote}`;

            this.container.appendChild(noteElement);
            document.getElementById('new-note').value = '';
            this.container.style.display = 'block';

            // Scroll the container to the bottom
            this.container.scrollTop = this.container.scrollHeight;
        }
    }

    endTranscript() {
        window.location.href = 'dashboard.html';
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    const transcript = new Transcript();
    new Notes();
    transcript.setInitialTitle();
});