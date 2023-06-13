document.addEventListener('DOMContentLoaded', function() {
    const userName = "johnDoe";

    // Update the welcome message
    document.getElementById('welcome-message').textContent = "Welcome, " + userName;

    // Fetch the user's transcripts from the server
    fetch(`/api/users/${userName}/transcripts`)
    .then(response => response.json())
    .then(transcripts => {
        // Populate the transcript list with data from the server
        const transcriptList = document.getElementById('transcript-list');
        for (let i = 0; i < transcripts.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = transcripts[i].title;
            listItem.classList.add('list-group-item');
            listItem.dataset.id = transcripts[i].id;  // Store the ID for later
            transcriptList.appendChild(listItem);
        }

        // Add event listeners to the list items
        const transcriptItems = document.querySelectorAll('#transcript-list .list-group-item');
        for (let i = 0; i < transcriptItems.length; i++) {
            transcriptItems[i].addEventListener('click', function() {
                const transcriptId = this.dataset.id;  // Get the ID from the dataset

                // Fetch the transcript's notes from the server
                fetch(`/api/users/${userName}/transcripts/${transcriptId}/notes`)
                .then(response => response.json())
                .then(notes => {
                    // Populate the notes for this transcript
                    let notesText = '';
                    for (let j = 0; j < notes.length; j++) {
                        notesText += `${notes[j].date}: ${notes[j].text}\n`;
                    }

                    // Find the transcript
                    const transcript = transcripts.find(transcript => transcript.id === transcriptId)
                    
                    // Set notes and transcript text
                    document.getElementById('notesModalBody').textContent = notesText;
                    document.getElementById('transcriptModalBody').textContent = transcript.text;

                    // Set the modal title
                    document.getElementById('transcriptModalLabel').textContent = transcript.title;

                    // Show the modal
                    $('#transcriptModal').modal('show');
                })
                    .catch(error => console.log(error.message + transcript));
            });
        }
    });
    fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit')
        .then(response => response.json())
        .then(jokeData => {
            let joke;
            if (jokeData.type === 'single') {
                joke = jokeData.joke;
            } else {
                joke = `${jokeData.setup} ${jokeData.delivery}`;
            }
            document.getElementById('joke').querySelector('.card-body').textContent = joke;
        })
        .catch(error => console.log('Failed to fetch a joke:', error));
});
