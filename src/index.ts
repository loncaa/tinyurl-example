import { createServer } from "./server";

const SERVER_PORT = process.env.SERVER_PORT || 3000;

createServer(SERVER_PORT);
