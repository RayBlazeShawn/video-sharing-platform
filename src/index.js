import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
import http from 'http';
import signalingServer from './signalingServer.js';

dotenv.config({ path: './env' });

connectDB()
  .then(() => {
    const server = http.createServer(app);

    signalingServer(server);

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => console.log('MongoDB connection failed !!!', err));
