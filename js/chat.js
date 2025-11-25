document.addEventListener('DOMContentLoaded', () => {
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
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          closePopover();
        }
      });
    });
  }

  // === Chat-funksjonalitet ===
  const chatBox = document.querySelector('.chat-box');
  const input = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const inputArea = document.querySelector('.chat-input-area');
  const keyInput = document.getElementById("key"); // feltet der du skriver inn API-nøkkel

 // Bytt til X når loading starter
function showLoading() {
  sendButton.classList.add("loading");

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

  return message;
}

function resetSendButton() {
  sendButton.classList.remove("loading");
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
    return message;
  }

  // Funksjon som snakker med OpenAI
  async function sendMessageToBot(userMessage, apiKey) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }]
      })
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}${errText ? ": " + errText : ""}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "(Ingen svar fra AI)";
  }

  // Event på send-knappen
sendButton.addEventListener('click', async () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, true);
  input.value = '';

  const loadingMsg = showLoading();

  try {
    const apiKey = keyInput.value.trim();
    if (!apiKey) throw new Error("Du må legge inn API-nøkkel.");
    const reply = await sendMessageToBot(text, apiKey);
    loadingMsg.remove();
    addMessage(reply, false);
  } catch (err) {
    loadingMsg.remove();
    addMessage("Feil: " + err.message, false);
  } finally {
    resetSendButton(); // ← bytt tilbake til pil / fjern loading
  }
});


  // Enter-tast sender melding
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendButton.click();
    }
  });

  // Startmelding / disclaimer
  addMessage("Merk: Chatboten kan gi feil eller ufullstendige svar. Ikke bruk den til sensitive beslutninger.", false);
});
