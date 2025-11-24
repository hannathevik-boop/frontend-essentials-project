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
const keyInput = document.getElementById("key");
const ultramarButton = document.getElementById("ultramar-button");
const output = document.getElementById("output");

function show(text) {
    output.hidden = false;
    output.textContent = text;
}

// EventListener for the button click
// We use "async" so we can use "await" later
ultramarButton.addEventListener("click", async () => {
    const apiKey = keyInput.value.trim();

    // Safegaurd: stop here and just return if user did not enter key
    if (!apiKey) {
        show("Warning: The machine spirit requires your OpenAI API key.");
        return;
    }

    show("The machine spirit considers your request...");
    ultramarButton.disabled = true;

    try {
        // This is where the "work" happens: we send an HTTP POST request to OpenAI
        // We use "await" because it pauses until the fetch completes
        // (we wait here until the network request is done)
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

        // Another "await", because reading the JSON may take some time (depending on size)
        const data = await res.json();

        // Finally, we read the content, or fallback to "no content" if empty
        const text = data.choices?.[0]?.message?.content ?? "(the machine spirit returns nothing)";
        show(text);

    } catch (e) {
        show("Error: " + (e?.message || e));
    } finally {
        ultramarButton.disabled = false;
    }
});