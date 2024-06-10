const socket = io();
const totalTag = document.getElementById("total");
const messageContainer = document.getElementById("message");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messageTyping = document.getElementById("feedback");

messageForm.addEventListener("submit", (e) => {
	e.preventDefault();
	sendMessage();
});
messageInput.addEventListener("focus", (e) => {
	socket.emit("feedback", {
		feedback: `✏️ ${nameInput.value} is typing a message...`,
	});
});
messageInput.addEventListener("keypress", (e) => {
	socket.emit("feedback", {
		feedback: `✏️ ${nameInput.value} is typing a message...`,
	});
});
messageInput.addEventListener("blur", (e) => {
	socket.emit("feedback", {
		feedback: ``,
	});
});

socket.on("clients-total", (data) => {
	totalTag.innerText = `Total Clients: ${data}`;
});

socket.on("typing", (data) => {
	clearFeedback();
	const element = `
                <li class="message_feedback">
					<p class="message_typing" id="feedback">
						${data.feedback}
					</p>
				</li>
                `;
	messageContainer.innerHTML += element;
	scrollToBottom();
});

function clearFeedback() {
	document.querySelectorAll("li.message_feedback").forEach((element) => {
		element.parentNode.removeChild(element);
	});
}

function sendMessage() {
	if (messageInput.value === "") return;
	const data = {
		name: nameInput.value,
		message: messageInput.value,
		dateTime: new Date(),
	};
	socket.emit("message", data);
	addMessageToUI(true, data);
	messageInput.value = "";
}

socket.on("chatMessage", (data) => {
	addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
	clearFeedback();
	let time;
	if (isOwnMessage) {
		time = data.dateTime;
	} else {
		time = new Date(data.dateTime);
	}
	const date =
		time.getDate() +
		" " +
		time.toLocaleString("default", { month: "long" }) +
		" " +
		time.getHours() +
		":" +
		time.getMinutes();

	const element = `
                <li class="${isOwnMessage ? "message_right" : "message_left"}">
					<p class="message_text">
						${data.message} <span> ${data.name} 📱 ${date}</span>
					</p>
				</li>
                `;
	messageContainer.innerHTML += element;
	scrollToBottom();
}
function scrollToBottom() {
	messageContainer.scrollTo(0, messageContainer.scrollHeight);
}
