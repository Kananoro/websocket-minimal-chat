import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { createServer } from "http";

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));

server.listen(PORT, () => {
	console.log(`🧑‍💻 Server running at: http://localhost:${PORT}`);
});

let socketsConnected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
	socketsConnected.add(socket.id);

	io.emit("clients-total", socketsConnected.size);

	socket.on("disconnect", () => {
		socketsConnected.delete(socket.id);
		io.emit("clients-total", socketsConnected.size);
	});

	socket.on("message", (data) => {
		socket.broadcast.emit("chatMessage", data);
	});

	socket.on("feedback", (data) => {
		socket.broadcast.emit("typing", data);
	});
}

app.use(express.static(path.join(__dirname, "public")));
