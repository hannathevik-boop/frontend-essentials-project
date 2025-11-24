document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const popoverMenu = document.getElementById('popover-menu');
  const closeMenu = document.querySelector('.close-menu');

  // Funksjon for å lukke meny
  function closePopover() {
    popoverMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  // Åpne meny
  hamburger.addEventListener('click', () => {
    popoverMenu.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
  });

  // Lukk meny via X-knapp
  closeMenu.addEventListener('click', () => {
    closePopover();
  });

  // Lukk meny når man klikker på en lenke
  document.querySelectorAll('.menu-list a').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        closePopover();
      }
    });
  });
});

  // === OpenAI-demo ===
  const keyInput = document.getElementById("key");
  const ultramarButton = document.getElementById("ultramar-button");
  const output = document.getElementById("output");

  function show(text) {
    output.hidden = false;
    output.textContent = text;
  }

  ultramarButton.addEventListener("click", async () => {
    const apiKey = keyInput.value.trim();
    if (!apiKey) {
      show("Warning: The machine spirit requires your OpenAI API key.");
      return;
    }

    show("The machine spirit considers your request...");
    ultramarButton.disabled = true;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "For the Glory of Ultramar!" }]
        })
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${errText ? ": " + errText : ""}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content ?? "(the machine spirit returns nothing)";
      show(text);
    } catch (e) {
      show("Error: " + (e?.message || e));
    } finally {
      ultramarButton.disabled = false;
    }
  });

  // === Chat-funksjonalitet ===
const chatBox = document.querySelector('.chat-box');
const input = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const inputArea = document.querySelector('.chat-input-area');

// Loading-boble
function showLoading() {
  const message = document.createElement('div');
  message.classList.add('chat-message','receiver');

  const avatar = document.createElement('h2');
  avatar.classList.add('chat-avatar');
  avatar.textContent = 'Fram';

  const bubble = document.createElement('div');
  bubble.classList.add('bubble','loading');
  bubble.innerHTML = '<span></span><span></span><span></span>';

  message.appendChild(avatar);
  message.appendChild(bubble);

  chatBox.insertBefore(message, inputArea);
  chatBox.scrollTop = chatBox.scrollHeight;

  return message; // så du kan fjerne den senere
}

// Disconnect-melding
function showDisconnect() {
  const message = document.createElement('div');
  message.classList.add('chat-message','receiver');

  const avatar = document.createElement('h2');
  avatar.classList.add('chat-avatar');
  avatar.textContent = 'Fram';

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.textContent = "The chat has been disconnected.";

  message.appendChild(avatar);
  message.appendChild(bubble);

  chatBox.insertBefore(message, inputArea);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Vanlig melding
function addMessage(content, sender = true) {
  let message;
  if (sender) {
    message = document.createElement('div');
    message.classList.add('chat-message','sender');
    message.textContent = content;
  } else {
    message = document.createElement('div');
    message.classList.add('chat-message','receiver');

    const avatar = document.createElement('h2');
    avatar.classList.add('chat-avatar');
    avatar.textContent = 'Fram';

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = content;

    message.appendChild(avatar);
    message.appendChild(bubble);
  }

  chatBox.insertBefore(message, inputArea);
  chatBox.scrollTop = chatBox.scrollHeight;
  return message; // gjør at du kan manipulere meldingen senere
}

sendButton.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, true);
  input.value = '';

  const loadingMsg = showLoading();
  setTimeout(() => {
    loadingMsg.remove();
    addMessage("Thanks for your message! We'll get back to you shortly.", false);
  }, 1000);
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendButton.click();
  }
});