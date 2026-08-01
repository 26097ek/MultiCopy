function copyText () {
    const text = sendMSG("COPY")
    console.log(text);
}

async function sendMSG (msg) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) return;
    if (/^(chrome||edge):\/\//.test(tab.url)){console.warn("Cannot inject content.js into privileged pages."); return;}

    try {
        const response = await chrome.tabs.sendMessage(tab.id, msg);
        console.log("Response from content.js: " + response)
        console.log("Text copied: " + response.text)
        return response
    } catch (error) {
        console.warn("Error: " + error + " Content script may not be injected yet.")
    }
}

chrome.commands.onCommand.addListener((command) => {
    if (command === "run-copy") {
        copyText();
    }
});