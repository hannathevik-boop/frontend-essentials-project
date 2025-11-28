
  // === HAMBURGER MENU ===
  const hamburger = document.querySelector('.hamburger');
  const popoverMenu = document.getElementById('popover-menu');
  const closeMenu = document.querySelector('.close-menu');

  function closePopover() {
    popoverMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && popoverMenu && closeMenu) {
    hamburger.addEventListener('click', () => {
      popoverMenu.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
    });

    closeMenu.addEventListener('click', () => {
      closePopover();
    });

    document.querySelectorAll('.menu-list a').forEach(link => {
      link.addEventListener('click', () => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          closePopover();
        }
      });
    });
  }
// === CHATBOT FUNCTIONALITY ===//
  const input = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const chatBox = document.querySelector(".chat-box");
const inputArea = document.querySelector(".chat-input-area");
 
let pageContext = "";
 
// Limit context to our content, for OpenAI
// Must be served!!!
async function loadPages() {
  try {
    const files = ["index.html", "products.html"];
 
    const texts = await Promise.all(
      files.map(f =>
        fetch(f)
          .then(r => r.ok ? r.text() : "")
          .catch(() => "")
      )
    );
 
    pageContext = texts.join("\n\n---\n\n");
 
  } catch (err) {
    console.error("Failed to load context:", err);
  }
}
 
loadPages();
 
function addMessage(text, sender = "sender") {
  const msg = document.createElement("div");
  msg.classList.add("chat-message", sender);
 
  if (sender === "receiver") {
    const avatar = document.createElement("h2");
    avatar.classList.add("chat-avatar");
    avatar.textContent = "Fram";
 
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.textContent = text;
 
    msg.appendChild(avatar);
    msg.appendChild(bubble);
  } else {
    msg.textContent = text;
  }
 
  chatBox.insertBefore(msg, inputArea);
  chatBox.scrollTop = chatBox.scrollHeight;
}
 
sendButton.addEventListener("click", async () => {
  const question = input.value.trim();
  if (!question) return;
 
  addMessage(question, "sender");
  input.value = "";
 
  addMessage("Thinking...", "receiver");
 
  const key = window.OPENAI_API_KEY;
  if (!key) {
    addMessage("Missing API key in config.js", "receiver");
    return;
  }
 
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + key
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Use the provided HTML content to answer questions clearly." },
          { role: "system", content: pageContext },
          { role: "user", content: question }
        ]
      })
    });
 
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "(no response)";
    chatBox.removeChild(chatBox.children[chatBox.children.length - 2]);
    addMessage(reply, "receiver");
 
  } catch (err) {
    addMessage("Error: " + err.message, "receiver");
  }
});
 
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendButton.click();
  }
});
 