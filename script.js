async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Display user message
  const userBubble = document.createElement("div");
  userBubble.className = "user-bubble";
  userBubble.textContent = "You: " + userMessage;
  chatBox.appendChild(userBubble);

  input.value = "";

  // Send to server
  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userMessage }),
  });

  const data = await response.json();

  // Display bot reply
  const botBubble = document.createElement("div");
  botBubble.className = "bot-bubble";
  botBubble.textContent = data.reply || "DarkGPT: No response.";
  chatBox.appendChild(botBubble);

  chatBox.scrollTop = chatBox.scrollHeight;
}
