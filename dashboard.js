document.addEventListener('DOMContentLoaded', function() {
    // Hardcoded user data
    const transcripts = [
        { id: 1, title: 'My Transcript from 5/1 at 8:00 AM', notes: 'Notes for transcript 1' },
        { id: 2, title: 'My Transcript from 5/4 at 4:00 PM', notes: 'Notes for transcript 2' },
        { id: 3, title: 'My Transcript from 5/10 at 2:00 PM', notes: 'Notes for transcript 3' }
    ];

    const userName = "Hank";

    // Update the welcome message
    document.getElementById('welcome-message').textContent = "Welcome, " + userName;

    // Populate the transcript list with hardcoded data
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

            // This is where I will fetch the transcript and notes from the DB using the ID
            // For now, here's some hard-coded transcript and notes
            const transcriptText = 'This is the hard-coded transcript for ID ' + transcriptId + '.';
            const notesText = 'These are the hard-coded notes for transcript ID ' + transcriptId + '.';
            document.getElementById('transcriptModalBody').textContent = transcriptText;
            document.getElementById('notesModalBody').textContent = notesText;

            // Set the modal title
            const transcriptTitle = transcripts.find(transcript => transcript.id === parseInt(transcriptId)).title;
            document.getElementById('transcriptModalLabel').textContent = transcriptTitle;

            // Show the modal
            $('#transcriptModal').modal('show');
        });
    }
});
