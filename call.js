document.addEventListener('DOMContentLoaded', function() {
    let notificationWords = ['Hank'];  // Store notification words in an array
    let dictionaryWords = [];  // Store dictionary words in an array

    // Set initial title
    const date = new Date();
    const transcriptTitle = document.getElementById('transcript-title');
    transcriptTitle.textContent = `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear().toString().slice(-2)} ${date.toLocaleTimeString()} Transcript`;

    // Handle clicks on the title
    transcriptTitle.addEventListener('click', function() {
        $('#changeTitleModal').modal('show');
    });

    // Save the new title
    const saveTitleButton = document.getElementById('saveTitle');
    saveTitleButton.addEventListener('click', function() {
        const newTitle = document.getElementById('newTitle').value;
        if (newTitle.trim() !== '') {
            transcriptTitle.textContent = newTitle;
            $('#changeTitleModal').modal('hide');
        }
    });

    // Function to add a word
    function addWord(word, containerId, wordArray) {
        // Create a new word element
        const wordElement = document.createElement('div');
        wordElement.classList.add('mb-2', 'd-flex', 'justify-content-between', 'align-items-center');

        // Add the word text
        const wordText = document.createElement('span');
        wordText.textContent = word;
        wordElement.appendChild(wordText);

        // Add the remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('btn', 'btn-danger');
        removeButton.addEventListener('click', function() {
            // Remove the word from the array
            const index = wordArray.indexOf(word);
            if (index > -1) {
                wordArray.splice(index, 1);
            }

            // Remove the element from the DOM
            wordElement.remove();
        });
        wordElement.appendChild(removeButton);

        // Add the word element to the modal body
        const container = document.getElementById(containerId);
        container.appendChild(wordElement);
    }

    // Handle opening of the transcript settings modal
    $('#transcriptSettingsModal').on('show.bs.modal', function () {
        const notificationContainer = document.getElementById('notificationWordsContainer');
        const dictionaryContainer = document.getElementById('dictionaryWordsContainer');
        notificationContainer.innerHTML = '';  // Clear existing words
        dictionaryContainer.innerHTML = '';  // Clear existing words

        const newNotificationWord = document.getElementById('newNotificationWord');
        const addNotificationWordButton = document.getElementById('addNotificationWord');
        const newDictionaryWord = document.getElementById('newDictionaryWord');
        const addDictionaryWordButton = document.getElementById('addDictionaryWord');

        addNotificationWordButton.addEventListener('click', function() {
            const newWord = newNotificationWord.value;
            if (newWord !== '' && !notificationWords.includes(newWord)) {
                notificationWords.push(newWord);
                addWord(newWord, 'notificationWordsContainer', notificationWords);
                newNotificationWord.value = '';  // Clear the input field
            }
        });

        addDictionaryWordButton.addEventListener('click', function() {
            const newWord = newDictionaryWord.value;
            if (newWord !== '' && !dictionaryWords.includes(newWord)) {
                dictionaryWords.push(newWord);
                addWord(newWord, 'dictionaryWordsContainer', dictionaryWords);
                newDictionaryWord.value = '';  // Clear the input field
            }
        });

        // Add each word
        for (const word of notificationWords) {
            addWord(word, 'notificationWordsContainer', notificationWords);
        }

        for (const word of dictionaryWords) {
            addWord(word, 'dictionaryWordsContainer', dictionaryWords);
        }
    });


    function saveNote() {
        // Get the note text
        const noteText = document.getElementById('new-note').value;

        // Check if the note is not empty
        if (noteText.trim() !== '') {
            // Create timestamp
            const date = new Date();
            const timestamp = date.toLocaleTimeString();

            // Create a new note element
            const noteElement = document.createElement('p');
            noteElement.textContent = timestamp + ': ' + noteText;

            // Add the note element to the existing notes
            const existingNotes = document.getElementById('existing-notes');
            existingNotes.appendChild(noteElement);

            // Clear the note input
            document.getElementById('new-note').value = '';

            // Scroll to the bottom
            noteElement.scrollIntoView();

            checkNoteExistence();
        }
    }

    function checkNoteExistence() {
        const existingNotes = document.getElementById('existing-notes');
        const noteElements = existingNotes.getElementsByTagName('p');

        if (noteElements.length === 0) {
            existingNotes.style.display = 'none';
        } else {
            existingNotes.style.display = 'block';
        }
    }

    // Attach the save note function to the save note button
    const saveNoteButton = document.getElementById('save-note');
    saveNoteButton.addEventListener('click', saveNote);
    // Get the "End Transcript" button
    const endTranscriptButton = document.getElementById('end-transcript');

    // Listen for click events on the "End Transcript" button
    endTranscriptButton.addEventListener('click', function() {
        // Implement server functionality here...

        // Redirect to dashboard.html
        window.location.href = 'dashboard.html';
    });

});


