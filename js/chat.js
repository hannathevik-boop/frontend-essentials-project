// === CHATBOT FUNCTIONALITY ===//

// Henter referanser til viktige elementer i DOM
const input = document.getElementById("chat-input");          // Tekstfeltet der brukeren skriver
const sendButton = document.getElementById("send-button");    // Knappen for å sende melding
const chatBox = document.querySelector(".chat-box");          // Hele chat-vinduet
const inputArea = document.querySelector(".chat-input-area"); // Området nederst med input og knapp
const originalSendHTML = sendButton.innerHTML; // Lagre originalt innhold for senere
let pageContext = ""; // Her lagres innholdet fra nettsidene vi henter inn

// === Laster inn HTML-sider som kontekst for chatboten ===
async function loadPages() {
  try {
    const files = ["index.html", "products.html"]; // Filene vi vil hente inn

    // Leser innholdet fra hver fil og samler det i en array
    const texts = await Promise.all(
      files.map(f =>
        fetch(f)
          .then(r => r.ok ? r.text() : "") // Hvis filen finnes, hent tekst
          .catch(() => "")                 // Hvis feil, returner tom streng
      )
    );

    // Slår sammen alt innholdet til én stor streng
    pageContext = texts.join("\n\n---\n\n");

  } catch (err) {
    console.error("Failed to load context:", err);
  }
}

loadPages(); // Kjør funksjonen med en gang

// === Legger til en melding i chatten ===
function addMessage(text, sender = "sender") {
  const msg = document.createElement("div");
  msg.classList.add("chat-message", sender); // Klassen avgjør styling (sender/receiver)

  if (sender === "receiver") {
    // Hvis meldingen kommer fra chatboten, legg til avatar og boble
    const avatar = document.createElement("h2");
    avatar.classList.add("chat-avatar");
    avatar.textContent = "Fram"; // Navn/ikon på chatboten

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.textContent = text; // Selve svaret

    msg.appendChild(avatar);
    msg.appendChild(bubble);
  } else {
    // Hvis meldingen kommer fra brukeren, bare vis teksten
    msg.textContent = text;
  }

  // Sett inn meldingen rett før input-området
  chatBox.insertBefore(msg, inputArea);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll ned til siste melding

  return msg; // Returner referansen til meldingen (nyttig for f.eks. å fjerne senere)
}

// === Viser en loading-boble med tre prikker ===
function addLoadingMessage() {
  const msg = document.createElement("div");
  msg.classList.add("chat-message", "receiver");

  const avatar = document.createElement("h2");
  avatar.classList.add("chat-avatar");
  avatar.textContent = "Fram";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble", "loading");
  bubble.innerHTML = "<span></span><span></span><span></span>"; // Tre prikker

  msg.appendChild(avatar);
  msg.appendChild(bubble);

  chatBox.insertBefore(msg, inputArea);
  chatBox.scrollTop = chatBox.scrollHeight;

  return msg; // Returner så boblen blir borte når svaret kommer
}

// Bytt til X når loading starter
function showLoadingButton() {
  sendButton.classList.add("loading");
  sendButton.innerHTML = ""; // x knapp 
}

// Sett tilbake til original send-knapp
function resetSendButton() {
  sendButton.classList.remove("loading");
  sendButton.innerHTML = originalSendHTML; // gjenoppretter SVG
}
// feilmelding ved tilkoblingsproblemer
function showConnectionError(message = "Failed to connect. Wait and try again later.") {
  const errorMsg = document.createElement("div");
  errorMsg.classList.add("chat-error");
  errorMsg.textContent = message;

  chatBox.insertBefore(errorMsg, inputArea);
  chatBox.scrollTop = chatBox.scrollHeight;
   // Fjern feilmeldingen automatisk etter 5 sekunder
  setTimeout(() => {
    if (errorMsg.parentNode) {
      errorMsg.parentNode.removeChild(errorMsg);
    }
  }, 5000);

  // Fjern feilmeldingen når brukeren begynner å skrive igjen
  input.addEventListener("input", () => {
    if (errorMsg.parentNode) {
      errorMsg.parentNode.removeChild(errorMsg);
    }
  }, { once: true }); // kjør bare én gang
}

// Håndterer klikk på send-knappen
sendButton.addEventListener("click", async () => {
  const question = input.value.trim(); // Hent tekst fra input
  if (!question) return;               // Ikke gjør noe hvis feltet er tomt

  addMessage(question, "sender"); // Legg til brukerens melding i chatten
  input.value = "";               // Tøm inputfeltet

  const loadingMsg = addLoadingMessage(); // Vis tre prikker mens vi venter
  showLoadingButton(); // ← bytt til X-knapp

  const key = window.OPENAI_API_KEY; // API-nøkkel må være definert i config.js
  if (!key) {
    chatBox.removeChild(loadingMsg);
    resetSendButton(); // tilbake til pil
    addMessage("Missing API key in config.js", "receiver");
    return;
  }

  try {
    // Send forespørsel til OpenAI API
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + key
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // AI modellen som brukes
        messages: [
          { role: "system", content: "Use the provided HTML content to answer questions clearly." },
          { role: "system", content: pageContext }, // Konteksten vi hentet fra sidene
          { role: "user", content: question }       // Brukerens spørsmål
        ]
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "(no response)";

    // Fjern loading-boblen og legg til svaret fra OPENAI
    chatBox.removeChild(loadingMsg);
    addMessage(reply, "receiver");
  } catch (err) {

    // Hvis noe går galt, fjern loading og vis feilmelding
    chatBox.removeChild(loadingMsg);
    showConnectionError("Failed to connect. Wait and try again later.");
    
  } finally {
    resetSendButton(); // alltid tilbake til pil når ferdig
  }
});

// === Lar brukeren trykke entertasten for å sende ===
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault(); // Hindrer linjeskift
    sendButton.click(); // Trigger samme logikk som ved klikk
  }
});

