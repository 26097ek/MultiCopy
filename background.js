async function copyText (slot) {
    try{
        const text = (await sendMSG("MtCp_COPY"))
        console.log(text);
        if (text.text[0]) await chrome.storage.session.set({[`S${slot}`]: text.text[0]})
    } catch (error) {
        console.warn(error)
    }
}

async function viewSlot (slot) {
    const {[`S${slot}`]:text} = await chrome.storage.session.get(`S${slot}`)
    sendMSG("MtCp_VIEW", text);
    console.log(text);
}

async function sendMSG (msg,pld=undefined) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) return;
    if (/^(chrome||edge:\/\/)/.test(tab.url)){console.warn("Cannot inject content.js into privileged pages."); return;}

    try {
        const response = await chrome.tabs.sendMessage(tab.id, {msg:msg,payload:pld});
        console.log(response)
        console.log("Text copied: " + response.text)
        return response
    } catch (error) {
        console.warn("Error: " + error + " Content script may not be injected yet.")
    }
}

chrome.commands.onCommand.addListener((command) => {
    if (command.startsWith("MtCp_Copy")) {
        copyText(command.slice(9));
    } else if (command.startsWith("MtCp_View")) {
        viewSlot(command.slice(9))
    }
});
