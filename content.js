chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("MSG Recived: " + message)
    if (message == "COPY") {
        const text = copyText();
        if (!text) return;
        sendResponse({ status: "success", text: [text]});
    };
  
    return true; 
});

function copyText() {
    const text = window.getSelection().toString();
    console.log("Copied text: " + text);
    return text;
}