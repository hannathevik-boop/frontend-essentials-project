document.addEventListener('DOMContentLoaded', () => {
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

  // === CHAT FUNCTIONALITY ===
  const chatBox = document.querySelector('.chat-box');
  const input = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const inputArea = document.querySelector('.chat-input-area');

  let indexDoc = null;
  let productsDoc = null;

  async function loadPages() {
    const parser = new DOMParser();
    try {
      const [indexRes, productsRes] = await Promise.all([
        fetch("index.html"),
        fetch("products.html")
      ]);
      if (indexRes.ok) {
        indexDoc = parser.parseFromString(await indexRes.text(), "text/html");
      }
      if (productsRes.ok) {
        productsDoc = parser.parseFromString(await productsRes.text(), "text/html");
      }
      console.log("Pages loaded:", { indexDoc, productsDoc });
    } catch (err) {
      console.error("Could not load pages:", err);
    }
  }

  function addMessage(content, sender = true) {
    let message;
    if (sender) {
      message = document.createElement('div');
      message.classList.add('chat-message', 'sender');
      message.textContent = content;
    } else {
      message = document.createElement('div');
      message.classList.add('chat-message', 'receiver');

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

  function getLocalInfo(userMessage) {
    const msg = userMessage.toLowerCase();

    // === Index.html ===
    if (msg.includes("FRAM") || msg.includes("index") || msg.includes("frontpage")) {
      if (!indexDoc) return "The front page has not been loaded yet.";
      const heroTitle = indexDoc.querySelector(".hero-title");
      const heroSubtitle = indexDoc.querySelector(".hero-subtitle");
      if (heroTitle && heroSubtitle) {
        return `The front page shows "${heroTitle.textContent}" with subtitle "${heroSubtitle.textContent}".`;
      }
      return "No hero section found on the front page.";
    }

    if (msg.includes("how") || msg.includes("works")) {
      if (!indexDoc) return "The front page has not been loaded yet.";
      const steps = indexDoc.querySelectorAll(".step-article");
      if (steps.length) {
        const info = Array.from(steps).map(step => {
          const title = step.querySelector("h3")?.textContent.trim();
          const text = step.querySelector("p")?.textContent.trim();
          return `• ${title}: ${text}`;
        }).join("\n");
        return `This is how it works:\n${info}`;
      }
      return "No 'How it works' section found.";
    }

    if (msg.includes("newsletter")) {
      const newsletterText = (indexDoc && indexDoc.querySelector(".newsletter-text")) ||
                             (productsDoc && productsDoc.querySelector(".newsletter-text"));
      return newsletterText ? newsletterText.textContent : "No newsletter section found.";
    }

    // === Products.html ===
    if (msg.includes("products") || msg.includes("produce")) {
      if (!productsDoc) return "The products page has not been loaded yet.";
      const productCards = productsDoc.querySelectorAll(".produce-card");
      if (productCards.length) {
        const items = Array.from(productCards).map(card => {
          const name = card.querySelector("h3, h5")?.textContent.trim();
          const price = card.querySelector(".produce-card-row p")?.textContent.trim();
          const weight = card.querySelector(".kg-row p")?.textContent.trim();
          return `${name} – ${price} (${weight})`;
        });
        return `The products shown are:\n${items.join("\n")}`;
      }
      return "No products found on the products page.";
    }

    if (msg.includes("farm") || msg.includes("location") || msg.includes("address")) {
      if (!productsDoc) return "The products page has not been loaded yet.";
      const mapFrame = productsDoc.querySelector(".map-frame");
      if (mapFrame) {
        const src = mapFrame.getAttribute("src");
        if (src.includes("Braastad")) {
          return "The location shown on the map is Braastad Farm, Oppdalslinna 242, 2740 Roa, Norway.";
        }
      }
      return "No farm location found.";
    }

    return "I can answer questions about FRAM.";
  }

  // === Start chat when pages are loaded ===
  loadPages().then(() => {
   
    sendButton.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, true);
      input.value = '';
      const reply = getLocalInfo(text);
      addMessage(reply, false);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendButton.click();
      }
    });
  });
});
