# Video Sharing Platform

This project is an attempt to create a video streaming and sharing platform using the MERN stack (MongoDB, Express.js, React, Node.js). The goal is to build a fully functional clone of popular video-sharing websites.

## Features

- **User Authentication**: Secure login and registration with JWT.
- **Video Upload and Playback**: Users can upload and watch videos.
- **User Interactions**: Users can like videos, comment on them, and post tweets.
- **Playlists**: Users can create playlists and add/remove videos.
- **Likes**: Users can like/unlike videos, comments, and tweets.
- **Subscriptions**: Users can subscribe to channels, manage their subscriptions, and view subscribers.
- **Real-time Streaming with WebRTC**: Users can start and stop live streams, and connect multiple peers for real-time video and audio streaming using WebRTC.

## Technologies Used

- **MongoDB**: Database for storing user data, video data, comments, likes, and playlists.
- **Express.js**: Web framework for handling API requests.
- **React**: Frontend library for building user interfaces (Note: React part is assumed to be separate).
- **Node.js**: JavaScript runtime for building the backend.
- **Mongoose**: ODM for MongoDB.
- **Cloudinary**: Cloud service for handling video uploads.
- **WebRTC**: Technology for real-time peer-to-peer communication.
- **WebSocket**: Used for the signaling server to facilitate WebRTC connections.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- MongoDB database URL.
- Cloudinary account for handling video uploads.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/RayBlazeShawn/video-sharing-platform.git
    cd video-sharing-platform
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_uri
    CORS_ORIGIN=*
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=your_access_token_expiry
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. Start the server:

    ```bash
    npm start
    ```

### Postman Collection

To make it easier to test the API, you can import the provided Postman collection:

1. Download the Postman collection JSON file from [this link](./Video-sharing-platform.postman_collection.json).

2. Open Postman, and click on the `Import` button in the upper left corner.

3. Select the `Choose Files` option and import the downloaded JSON file.

4. Once imported, you will see the collection named "Video Sharing Platform" in your Postman collections with the following folder structure:

   - **user**
      - POST register
      - POST login
      - POST login Copy
      - POST logout
      - POST refreshToken
   - **videos**
      - POST publish
      - PUT updateVideo
      - POST getAllVideos
      - GET getVideoById
      - GET getVideoById Copy
      - PATCH togglePublish
   - **comment**
      - GET getVideoComments
      - POST addComment
      - PUT updateComment
      - DELETE deleteComment
   - **tweets**
      - POST Create Tweet
      - GET Get All Tweets
      - GET Get Tweet by ID
      - PUT Update Tweet
      - DELETE Delete Tweet
   - **likes**
      - POST Like Entity
      - POST Unlike Entity
   - **playlists**
      - POST Add Entity
      - DELETE Remove Entity
   - **subscriptions**
     - POST Toggle Subscripions
     - GET Subscribers List
     - GET Channel List
   

### Usage

- The collection includes pre-configured requests for user registration, login, video upload, comment management, tweet management, liking/unliking, and playlist management.
- Make sure to set the environment variables in Postman for any necessary tokens and URLs.

### Example Request

Here’s how to make an example request using the imported Postman collection:

1. **User Registration**:
   - In Postman, open the "Video Sharing Platform" collection.
   - Navigate to the `POST {{server}}/users/register` request.
   - Fill in the required body parameters (e.g., username, email, password).
   - Click `Send` to make the request.

2. **User Login**:
   - Navigate to the `POST {{server}}/users/login` request.
   - Fill in the required body parameters (e.g., email, password).
   - Click `Send` to make the request.
   - Copy the received access token to use in authenticated requests.

3. **Authenticated Requests**:
   - Ensure that Postman is set to automatically use cookies. You can check this in the `Cookies` tab in Postman.
   - For requests that require authentication, the stored cookies will be used automatically.
   
For more details, refer to the specific requests in the Postman collection.

### WebRTC Signaling Server Setup

To enable real-time streaming and peer-to-peer communication, this platform uses a WebRTC signaling server. Here's how to set it up:

1. **Start the Signaling Server**:

   The signaling server facilitates the exchange of signaling data (SDP offers, answers, and ICE candidates) between peers.

   The server code is available in `src/signalingServer.js`.

2. **Connect Peers Using WebSocket**:

   You can use a WebSocket client like `wscat` to connect to the signaling server and exchange signaling messages.

   **Install `wscat`**:
    ```sh
    npm install -g wscat
    ```

   **Connect Peers**:
    ```sh
    wscat -c ws://localhost:8000
    ```

3. **Exchange Signaling Messages**:

   **Peer A**:
    ```sh
    > {"offer": {"type": "offer", "sdp": "v=0..."}}
    ```

   **Peer B**:
    ```sh
    > {"answer": {"type": "answer", "sdp": "v=0..."}}
    ```

   **ICE Candidates**:
    ```sh
    > {"candidate": {"candidate": "candidate:842163049 1 udp 1677729535 192.168.1.2 12345 typ srflx raddr 0.0.0.0 rport 0 generation 0 ufrag EEtu network-cost 999", "sdpMid": "video", "sdpMLineIndex": 0}}
    ```
