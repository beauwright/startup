[Class notes are located here](notes.md)
# Callsidekick.app - Boost Your Video Call Productivity

It's hard to appear professional and remain engaged in video calls. **Callsidekick.app** enables users to be more productive during remote calls. Using the screen share audio and microphone audio features in Chromium browsers (as well as Rev AI's realtime speech-to-text API), a live transcript of everything spoken in the call is generated. When the user's name is spoken during the call or when any other watch phrases the user sets are spoken during the call, Callsidekick.app notifies the user and jumps to that location in the transcript. With Callsidekick.app, users can remain attentive during the call and always have the needed context to give thoughtful and confident answers in video calls.

## Key Features

- Secure user authentication and account creation
- Uses screen share audio and microphone audio features in Chromium browsers
- Integration with Rev AI's realtime speech-to-text API to generate transcript of audio
- Automatic notifications and transcript location jumps when user's name or custom other phrases the user chooses to watch for are mentioned in the transcript
- Customizable watch phrases for personalized notifications
- Easy access to previous transcripts and the ability to start new transcript generation sessions
- Real-time audio-to-text conversion using websockets
- Storage of user information, previous transcripts, and notes in the database

### Authentication

Users create accounts and log in to view their previous transcripts or start a new transcript generation session.

### Websockets

Using a web socket, the user sends an audio stream to the server and receives near real-time conversion of that audio as text from the server. The server also creates a websocket with the Rev AI's API to convert the audio to text. Using the text received from the API, the server does some formatting to the text, looks for any watch phrases set by the user, and then passes formatted text along to the user as a transcript of the call.

### Database

Store user information, store previous transcripts, and notes belonging to the user.

## Wireframes
### Homepage
![Homepage](wireframes/homewireframe.jpg)
### Login and sign up
![Login](wireframes/loginwireframe.jpg)
![Register](wireframes/signupwireframe.jpg)
![Forgot password](wireframes/forgotpasswordwireframe.jpg)
![Reset password](wireframes/resetpasswordwireframe.jpg)
### 404 page
![404 page](wireframes/404wireframe.jpg)
### User dashboard
![User dashboard](wireframes/userdashboardwireframe.jpg)
### Call transcript generation page
![Call transcript generation](wireframes/generatetranscriptwireframe.jpg)
### Add a new watch phrase popup
![Watch phrase popup](wireframes/watchphrasepopupwireframe.jpg)
