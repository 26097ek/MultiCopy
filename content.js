chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log(sender)
    console.log(message)
    if (!message.msg.startsWith("MtCp_")) return;
    console.log("MSG Recived: " + message.msg)
    if (message.payload) console.log("Payload: " + message.payload)
    switch (message.msg) {
        case "MtCp_COPY":
            const text = copy();
            //console.log(text)
            if (!text) return;
            sendResponse({ status: "success", text: [text]});
            break;
        case "MtCp_VIEW":
            console.log(message.payload)
            const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
            const sliceIt = (str) => 
                [...segmenter.segment(str)].slice(0, 15).map(s => s.segment).join('');
            view([...message.payload].length<15?message.payload:(sliceIt(message.payload)+"..."))
            sendResponse({ status: "success", });
            break;
        case "MtCp_PSTE":
            //
            break;
        default:
            console.error("content.js: Unknown instruction from background.js: " + message.msg)
    };
  
    return true; 
});

function copy() {
    const active = document.activeElement;
    if (active.tagName!=="IFRAME")console.log(active.tagName);
    if (active && /INPUT|TEXTAREA/.test(active.tagName)){
        const text = active.value.substring(active.selectionStart,active.selectionEnd);
        console.log(text);
        return(text);
    } else if (active.tagName === "IFRAME"){
        return;
    } else {
        const text = window.getSelection().toString();
        console.log("Copied text: " + text);
        return text;
    };
};

async function view(text) {
    const X = window.devicePixelRatio * mouse.x
    const Y = window.devicePixelRatio * mouse.y
    box.style.left = (X - (box.offsetWidth / 2))+ "px";
    box.style.top = (Y - (box.offsetHeight * 1.5)) + "px";
    box.textContent = text || "No text copied"
    box.style.display = "block"
    await new Promise(resolve => setTimeout(resolve, 5000));
    box.style.display = "none"
}

const mouse = {x:0,y:0}

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}, {passive:true})

//Shadow root initialization
    const extHost = document.createElement("div")
    extHost.id = "MtCp_Shadow-Root"
    document.body.appendChild(extHost)
    const shadow = extHost.attachShadow({ mode: "open" })
    shadow.innerHTML = `
    <style>
        span{ 
        all: initial;
        padding: 5px;
        z-index: 999999999;
        position: fixed;
        display: none;
        background-color: #000;
        border-radius: 5px;
        border: 4px solid #f00;
        color: #fff;
        top: 0px;
        left: 0px;
        user-select: none;
        white-space: nowrap;
        pointer-events:none;
        }
    </style>
    <span id="MtCp_Box">Insert View Here</span>
    `;

    const box = shadow.querySelector("#MtCp_Box");
//End of shadow root initialization
