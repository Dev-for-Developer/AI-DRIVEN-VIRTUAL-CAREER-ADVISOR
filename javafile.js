const API_KEY = "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"; // Replace with your real OpenRouter API key

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML += `<div class="message user"><strong>You:</strong> ${message}</div>`;
  input.value = "";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost", // Optional – update to your real URL if hosted
        "X-Title": "My Chatbot",             // Optional – name for leaderboard/rankings
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    console.log("RESPONSE:", data);

    const botReply =
      data.choices?.[0]?.message?.content ||
      data.error?.message ||
      "No response";

    chatbox.innerHTML += `<div class="message bot"><strong>Bot:</strong> ${botReply}</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;
  } catch (error) {
    console.error("Fetch Error:", error);
    chatbox.innerHTML += `<div class="message bot"><strong>Bot:</strong> Error contacting OpenRouter API.</div>`;
  }
}
// Enable ENTER key to send message
document.getElementById("user-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submission (if any)
      sendMessage();      // call your existing function
    }
  });
  // Toggle Light/Dark Mode
document.getElementById("theme-toggle-btn").addEventListener("click", () => {
    const body = document.body;
    const toggleBtn = document.getElementById("theme-toggle-btn");
  
    body.classList.toggle("dark");
  
    if (body.classList.contains("dark")) {
      toggleBtn.textContent = "🌞 Light Mode";
    } else {
      toggleBtn.textContent = "🌙 Dark Mode";
    }
  });
// 🎤 Voice-to-text using Web Speech API
const micBtn = document.getElementById("mic-btn");
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";

micBtn.addEventListener("click", () => {
  recognition.start();
  micBtn.textContent = "🎙️ Listening...";
});

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  document.getElementById("user-input").value = transcript;
  sendMessage(); // Auto send after voice input
  micBtn.textContent = "🎤";
};

recognition.onerror = (event) => {
  alert("Voice input error: " + event.error);
  micBtn.textContent = "🎤";
};
  