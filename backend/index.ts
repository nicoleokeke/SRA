import cors from 'cors';
import express from 'express';
import routes from './src/routes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectMONGO = async () => {
  const uri = process.env.MONGO_URL;

  if (uri == null) {
    throw new Error('MONGO_URI is not defined');
  }

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

connectMONGO().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

app.use('/', routes);

const port = process.env.PORT ?? 3000;
const server = app.listen(port, () => {
  console.info(`Listening to port ${port}`);
});

// Exception handling
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  if (server != null) {
    server.close();
  }
});

function unexpectedErrorHandler(err: unknown) {
  console.error('An unexpected error occurred:', err);
  exitHandler();
}

function exitHandler() {
  if (server != null) {
    server.close(() => {
      console.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}
