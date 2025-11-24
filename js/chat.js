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
  sendButton.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M2 2 L12 12 M12 2 L2 12" stroke="white" stroke-width="2"/>
    </svg>
  `;

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

// Bytt tilbake til pil når loading er ferdig
function resetSendButton() {
  sendButton.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7.53125 0.25L12.7812 5.75C13.0625 6.0625 13.0625 6.53125 12.75 6.8125C12.4375 7.09375 11.9688 7.09375 11.6875 6.78125L7.75 2.625V13.25C7.75 13.6875 7.40625 14 7 14C6.5625 14 6.25 13.6875 6.25 13.25V2.625L2.28125 6.78125C2 7.09375 1.53125 7.09375 1.21875 6.8125C0.90625 6.53125 0.90625 6.03125 1.1875 5.75L6.4375 0.25C6.59375 0.09375 6.78125 0 7 0C7.1875 0 7.375 0.09375 7.53125 0.25Z" fill="white"/>
    </svg>
  `;
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
  resetSendButton(); // ← bytt tilbake til pil
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
