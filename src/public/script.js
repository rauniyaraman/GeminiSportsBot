document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = userInput.value.trim();
    if (!query) return;

    appendMessage("user", query);
    userInput.value = "";
    userInput.disabled = true;

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      appendMessage("bot", data.response);
    } catch (error) {
      appendMessage("bot", "An error occurred. Please try again.");
    }

    userInput.disabled = false;
    userInput.focus();
    scrollToBottom();
  });

  function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.innerHTML = `<div class="message-text">${message || "I couldn't fetch the information. Please try again."}</div>`;
    chatLog.appendChild(messageDiv);
  }
  
  function scrollToBottom() {
    chatLog.scrollTop = chatLog.scrollHeight;
  }
});
