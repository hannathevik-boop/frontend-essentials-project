# Sustainable food webshop

## Prosjektbeskrivelse

Fram er en bærekraftig dagligvaretjeneste som sørger for at kjøkkenet ditt alltid er fylt med sesongens nødvendigheter. Du bestiller enkelt via nett, mottar varene i gjenbrukbare beholdere, og rebestiller med et QR-scan. Ved neste levering byttes tomme beholdere ut, vaskes og brukes på nytt. Fram skal være et system for sirkulær forbruk og mindre avfall.

For ekstra støtte tilbyr Farm en innebygd chatbot som hjelper deg med bestilling, reordering, og praktiske spørsmål underveis. Chatboten gir personlig veiledning, forslag basert på sesongens utvalg, og gjør hele prosessen enda mer brukervennlig.

## Oppsett og installasjon

Det kreves ingen avansert installasjon for å kjøre denne siden lokalt. Prosjektet er bygget med HTML, CSS og JavaScript, og krever kun en moderne nettleser for å vises korrekt. Dersom du ønsker å gjøre endringer i kildekoden, anbefales det å ha Node.js installert for å kunne bruke utviklingsverktøy som for eksempel bundling eller live server. Ingen API-nøkler eller backend-integrasjoner er nødvendig i denne versjonen.

## Slik kjører du lokalt

Last ned prosjektmappen eller klon Git-repositoriet til din lokale maskin.

Åpne index.html direkte i nettleseren din.

Alternativt, hvis du bruker VS Code eller en annen editor med live server: – Åpne prosjektmappen i editoren – Høyreklikk på index.html og velg “Åpne med Live Server” – Siden åpnes da automatisk i nettleseren

## Kjente begrensninger

Dette er en eksamensoppgave, og det er ikke mulig å handle varer på ekte. Man kan derfor ikke gå inn i handlekurven eller legge produkter inn i den. Chat‑funksjonen er en demonstrasjon og ikke koblet til et reelt kundesystem.


## Chat Features
Send messages: Brukermeldinger vises i blå bobler.

Bot replies: Bot‑meldinger vises med avatar og beige boble.

Loading state: Tre animerte prikker vises mens man venter på svar.

Disconnect state: Bot kan signalisere når chatten er avsluttet.

Bruk av API‑nøkkel
For å kjøre chatten må man ha en gyldig API‑nøkkel fra OpenAI. Nøkkelen er personlig og skal ikke deles i koden eller dokumentasjonen.

Eksempel på hvordan chatten kan startes med nøkkel (uten å vise selve nøkkelen):

javascript
const apiKey = "DIN_API_NØKKEL_HER"; // nøkkelen må eier selv legge inn

async function sendMessageToBot(userMessage) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

  const data = await response.json();
  return data.choices[0].message.content;
}