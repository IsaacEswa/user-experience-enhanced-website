// Script voor het commentaarformulier op de details pagina
const articleForm = document.querySelector('.article-comment-form')
console.log('formulier:', articleForm)

const formButton = document.querySelector('.article-comment-form button')
const articleComments = document.querySelector('.recent-comments-container ul')

// Als er op de submit button wordt geklikt ...
articleForm.addEventListener('submit', async function (event) {
    // Voorkom de standaard submit van de browser
    // Let op: hiermee overschrijven we de default Loading state van de browser...
    event.preventDefault()

    //Loading state tonen:
    formButton.classList.add('loading')
    formButton.textContent = 'Verzenden...'

    //formdata voorbereiden:
    let formData = new FormData(articleForm);

    // Data fetchen:
    // Doe een fetch naar de server, net als hoe de browser dit normaal zou doen
    // Gebruik daarvoor het action en method attribuut van het formulier
    // Stuur de formulierelementen mee
    const response = await fetch(articleForm.action, {
        method: articleForm.method, //POST dus
        body: new URLSearchParams(formData) // <<< Dit moet omdat server.js anders niet met de formulier data kan werken
    })

    // Data verwerken:
    // De server geeft data terug als het posten goed gaat
    const responseData = await response.text()

    // Normaal zou de browser die HTML parsen en weergeven, maar daar moeten we nu zelf iets mee
    // Parse de nieuwe HTML en maak hiervan een nieuw Document Object Model in het geheugen
    const parser = new DOMParser()
    const responseDOM = parser.parseFromString(responseData, 'text/html')

    // Zoek in die nieuwe HTML DOM onze nieuwe UI state op, die we via Liquid hebben klaargemaakt
    const newState = responseDOM.querySelector('.recent-comments ul')

    // data van de server toevoegen aan de DOM, aan de scorelijst in de ol
    // Overschrijf de HTML met de nieuwe HTML
    if (newState) {
        articleComments.innerHTML = newState.innerHTML
    }
    // Loading state weghalen
    // Nu kan je waarschijnlijk de Loading state vervangen door een Success state
    console.log("Loading state weghalen")
    formButton.classList.remove('loading')
    formButton.textContent = 'Verzonden'

    articleForm.reset()
})