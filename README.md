[Class notes are located here](notes.md)
# Callsidekick.app - Boost Your Video Call Productivity

It's hard to appear professional and remain engaged in video calls. **Callsidekick.app** enables users to be more productive during remote calls. Using the screen share audio and microphone audio features in Chromium browsers (as well as Rev AI's realtime speech-to-text API), a live transcript of everything spoken in the call is generated. When the user's name is spoken during the call or when any other watch phrases the user sets are spoken during the call, Callsidekick.app notifies the user and jumps to that location in the transcript. With Callsidekick.app, users can remain attentive during the call and always have the needed context to give thoughtful and confident answers in video calls.

## Key Features

- Secure user authentication and account creation
- Uses screen share audio and microphone audio features in Chromium browsers
- Integration with Rev AI's realtime speech-to-text API to generate transcript of audio
- Automatic notifications and transcript location jumps when user's name or other custom phrases the user chooses to watch for are mentioned in the transcript
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


# HTML Deliverable
## Properly structured HTML
- HTML pages exist for each component of the application ✅
- HTML pages link between pages as necessary ✅
- Lorem ipsum text added for generated text, other needed text is written into the HTML ✅
- Logo image added to the header of [index.html](/index.html)
- Placeholder for 3rd party service added in [call.html](/call.html) ✅
- A placeholder for logging in and logging out added in [login.html](/login.html) and [signup.html](/signup.html), a placeholder for where the user's name will be displayed in the dashboard after logging in is added in [dashboard.html](/dashboard.html) ✅
- Database data placeholder added to [dashboard.html](/dashboard.html) ✅
- Websocket data placeholder added to [call.html](/call.html) ✅
##
There are multiple Git commits, each with a specific, useful comment attached ✅


# CSS Deliverable
## Properly styled CSS
- Header, footer, and main content body added ✅
- Navigational elements added ✅
- Application elements present ✅
- Application text content present ✅
- Image present (website logo in the header of every page) ✅
## What changed in the CSS Version?
Boostrap CSS was added to the pages, boostrap CSS classes added to HTML, some general restructuring of the HTML from the HTML-only version to work with the expected formatting for bootstrap header and footer, changed the call page HTML so that the notes and transcripts would be displayed side-by-side. Some small tweaks to the marketing copy text on the home page.
## 
There are multiple Git commits, each with a specific, useful comment attached ✅


# JavaScript Deliverable
## Significant use of JavaScript
- Support for future login ✅
  - Each user has a custom dashboard that will be fully implemented after login and DB are implemented, email is saved to local storage for now
- Support for future DB data ✅
  - DB values will be used to load a custom list of transcripts in the dashboard and display the user's name in the dashboard. The user's name is also added as a watch phrase in the call page
- Support for future WebSocket ✅
  - Screen share and microphone audio access acquired to send over a future WebSocket
- Support for your applications interaction logic  ✅
  - In the call page, users can take notes, change the transcript title, add and remove notification words and dictionary words
## What changed in the JavaScript version?
The Bootstrap JS was added to make the header navigation functional. Clicking on transcripts in the dashboard now opens a popup where the transcript and notes taken for that call appear.

In the call page, the user can now edit the title, take notes, and edit the transcript settings to add or remove notification words and custom dictionary words.

JS was used to add a nice fade in effect to the cards on the home page as you scroll.
## 
There are multiple Git commits, each with a specific, useful comment attached ✅

# Startup Service
- Simon service deployed ✅
- Create an HTTP service using Node.js and Express ✅
  - Done!
- Frontend served up using Express static middleware ✅
  - The static middleware now handles serving up the front end
- Your frontend calls third party service endpoints ✅
  - There's a third party joke API called at the bottom of the user's dashboard
- Your backend provides service endpoints ✅
  - Endpoints exist for retrieving existing transcripts, making new transcripts, updating existing transcripts, and creating notes
- Your frontend calls your service endpoints ✅
  - My frontend makes good use of my service endpoints
## What changed in the service version?
Endpoints were added and transcripts and notes were stored in the servers memory since the DB hadn't been implemented yet.
## 
There are multiple Git commits, each with a specific, useful comment attached ✅


# Startup DB
- Simon DB deployed ✅
- MongoDB Atlas database created ✅
  - A mongoDBDB was created and is used to store login info, transcripts, and notes
- Provides backend endpoints for manipulating application data ✅
  - The backend has endpoints for creating transcripts, updating transcripts, and creating notes
- Stores application data in MongoDB ✅
  - The transcripts and notes text are stored in mongoDB
## What changed in the DB version?
A lot changed here. The hardcoded user was removed, authentication was started, and transcripts and notes were stored in the DB rather than the server's memory. This required some additional endpoints.
## 
There are multiple Git commits, each with a specific, useful comment attached ✅


# Login Deliverable
- Simon login deployed ✅
- Supports new user registration ✅
  - Users can register an account
- Supports existing user authentication ✅
  - Users can login
- Stores and retrieves credentials in MongoDB ✅
  - User's login info is stored in a MongoDB
- Restricts application functionality based upon authentication ✅
  - Users are restricted to seeing content related to their own account
## What changed for the login version?
Proper login supported!
## 
There are multiple Git commits, each with a specific, useful comment attached ✅

# WebSocket Deliverable
- Simon websocket deployed ✅
- Backend listens for WebSocket connection ✅
  - The backend listens for the websocket connection
- Frontend makes WebSocket connection ✅
  - When the "start transcript" button is pressed on the call page, the frontend establishes a websocket with the backend
- Data sent over WebSocket connection ✅
  - The backend listens for a binary stream of audio and then forwards the binary audio stream on to Rev AI for transcription. The backend listens for text from Rev AI and passes that back to the front end over the websocket.
  - (Note to TAs the current implementation requires your computer supports a 44100HZ sample rate for audio which is very likely does unless you've got a fancy external audio interface that's locked to 48000 HZ)
- WebSocket data displayed in the application interface ✅
  - The transcription text sent to the front end is shown in the big left box.
## What changed for the WebSocket version?
A crazy amount of work went into this one. Unfortunately, I had to drop some transcript settings that were in earlier versions and screenshare audio to focus on getting the websocket complete but I plan on finishing this later on my own, and it doesn't affect any of the website requirements for this class.

Additionally, I had to figure out how to capture microphone audio as 16 Bit INT uncompressed audio and send it as a binary stream to the server to pass on to Rev AI. This meant learning a lot more about how audio works than I realized I would need to!

The transcript text received back from Rev AI over a websocket is then passed back to the user over their websocket which means the transcript text is finally functional and no longer just placeholder text!
##
There are multiple Git commits, each with a specific, useful comment attached ✅

# React Deliverable
- Bundled using Vite ✅
  - The Vite toolchain is used in this latest version
- Multiple functional react components
  - The login, signup, and homepage as well as the NavBar and Footer are now React components. The call page is still vanilla JavaScript and HTML. Hopefully I can get some credit for this work? The call.js was pretty complicated and I ran out of time to recreate it in React.
- React router ✅
  - The react router hooks together all the react pages
- React hooks
  - The useState hook is used in the login and signup pages
##
There are multiple Git commits, each with a specific, useful comment attached ✅
