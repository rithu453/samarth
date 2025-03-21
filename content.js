(function() {
    if (document.getElementById("ai-chat-toggle")) return; // Prevent multiple instances

    // Create floating button
    let button = document.createElement("div");
    button.id = "ai-chat-toggle";
    button.innerText = "💬";
    button.onclick = toggleChat;
    document.body.appendChild(button);

    // Create chat container
    let chatContainer = document.createElement("div");
    chatContainer.id = "ai-chat-container";
    chatContainer.innerHTML = `
        <div id="ai-chat-header">
            <span>AI Chat</span>
            <button id="close-chat">✖</button>
        </div>
        <div id="ai-chat-box"></div>
        <div id="ai-chat-input">
            <input type="text" id="chat-input" placeholder="Ask something..." />
            <button id="send-chat">➤</button>
        </div>
        <button id="generate-mindmap">🧠 Generate Mind Map</button>
        <div id="mindmap-container"></div>
    `;
    document.body.appendChild(chatContainer);

    // Close chat button
    document.getElementById("close-chat").addEventListener("click", () => {
        chatContainer.style.display = "none";
    });

    // Event listeners
    document.getElementById("send-chat").addEventListener("click", sendChatMessage);
    document.getElementById("chat-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendChatMessage();
    });
    document.getElementById("generate-mindmap").addEventListener("click", generateMindMap);

    // Show/hide chat
    function toggleChat() {
        chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
    }

    // Send chat query
    function sendChatMessage() {
        let inputField = document.getElementById("chat-input");
        let query = inputField.value.trim();
        if (!query) return;
        addMessage(query, "user");
        inputField.value = "";
        askGemini(query, document.body.innerText);
    }

    // Fetch AI response
    function askGemini(userMessage, pageText) {
        let apiKey = "AIzaSyCwdDvKqc-W9Ucmve5tU2OemneMPvymVEA";  // Replace with your actual key
        let apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
        let requestBody = {
            contents: [{
                parts: [
                    { text: `User Question: ${userMessage}\n\nWebpage Content: ${pageText}\n\nAnswer:` }
                ]
            }]
        };
    
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.candidates && data.candidates.length > 0) {
                addMessage(data.candidates[0].content.parts[0].text, "bot");
            } else {
                addMessage("I couldn't generate a response. Try again!", "bot");
            }
        })
        .catch(error => {
            addMessage("Error connecting to AI.", "bot");
            console.error("API Error:", error);
        });
    }

    // Add messages to chat
    function addMessage(text, sender) {
        let chatBox = document.getElementById("ai-chat-box");
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.innerText = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Generate mind map
    function generateMindMap() {
        let summary = document.getElementById("ai-chat-box").innerText;
        let mindMapData = `graph TD; A[Summary] -->|Key Points| B(${summary.replace(/\n/g, ";")})`;
        let mindMapContainer = document.getElementById("mindmap-container");
        mindMapContainer.innerHTML = `<pre class="mermaid">${mindMapData}</pre>`;
        mermaid.init(undefined, mindMapContainer);
    }

})();

// Load Mermaid.js if not already present
if (!document.getElementById("mermaidScript")) {
    let script = document.createElement("script");
    script.id = "mermaidScript";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.2.0/mermaid.min.js";
    document.body.appendChild(script);
    script.onload = () => mermaid.initialize({ startOnLoad: false });
}




// (function () {
//     if (document.getElementById("ai-chat-toggle")) return; // Prevent multiple instances

//     // Create floating button
//     let button = document.createElement("div");
//     button.id = "ai-chat-toggle";
//     button.innerText = "💬";
//     button.onclick = toggleChat;
//     document.body.appendChild(button);

//     // Create chat container
//     let chatContainer = document.createElement("div");
//     chatContainer.id = "ai-chat-container";
//     chatContainer.innerHTML = `
//         <div id="ai-chat-header">
//             <span>AI Chat</span>
//             <button id="close-chat">✖</button>
//         </div>
//         <div id="ai-chat-box"></div>
//         <div id="ai-chat-input">
//             <input type="text" id="chat-input" placeholder="Ask something..." />
//             <button id="send-chat">➤</button>
//         </div>
//         <button id="summarize-page">📄 Summarize Page</button>
//         <button id="generate-mindmap">🧠 Generate Mind Map</button>
//         <div id="mindmap-container"></div>
//     `;
//     document.body.appendChild(chatContainer);

//     // Style for scrolling chat box
//     let style = document.createElement("style");
//     style.innerHTML = `

//         #ai-chat-toggle {
//     position: fixed;
//     bottom: 20px;
//     right: 20px;
//     width: 50px;
//     height: 50px;
//     background: #007bff;
//     color: white;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 24px;
//     cursor: pointer;
//     box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
//     z-index: 9999;
// }
//         #ai-chat-container {
//             position: fixed;
//             bottom: 20px;
//             right: 20px;
//             width: 320px;
//             background: white;
//             border-radius: 10px;
//             box-shadow: 0 4px 8px rgba(0,0,0,0.2);
//             display: none;
//             flex-direction: column;
//             z-index: 1000;
//         }
//         #ai-chat-header {
//             padding: 10px;
//             background: #007bff;
//             color: white;
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//         }
//         #ai-chat-box {
//             height: 250px;
//             overflow-y: auto;
//             padding: 10px;
//             display: flex;
//             flex-direction: column;
//             gap: 5px;
//         }
//         .message {
//             padding: 8px;
//             border-radius: 5px;
//             max-width: 80%;
//             word-wrap: break-word;
//         }
//         .user {
//             background: #e1f5fe;
//             align-self: flex-end;
//         }
//         .bot {
//             background: #f1f1f1;
//             align-self: flex-start;
//         }
//         #ai-chat-input {
//             display: flex;
//             padding: 10px;
//             border-top: 1px solid #ccc;
//         }
//         #chat-input {
//             flex: 1;
//             padding: 8px;
//             border: 1px solid #ccc;
//             border-radius: 5px;
//         }
//         #send-chat, #summarize-page, #generate-mindmap {
//             margin-left: 5px;
//             padding: 8px;
//             background: #007bff;
//             color: white;
//             border: none;
//             border-radius: 5px;
//             cursor: pointer;
//         }
//         #mindmap-container {
//             padding: 10px;
//         }
//     `;
//     document.head.appendChild(style);

//     // Close chat button
//     document.getElementById("close-chat").addEventListener("click", () => {
//         chatContainer.style.display = "none";
//     });

//     // Event listeners
//     document.getElementById("send-chat").addEventListener("click", sendChatMessage);
//     document.getElementById("chat-input").addEventListener("keypress", (e) => {
//         if (e.key === "Enter") sendChatMessage();
//     });

//     document.getElementById("summarize-page").addEventListener("click", summarizePage);
//     // document.getElementById("generate-mindmap").addEventListener("click", generateMindMap);

//     // Show/hide chat
//     function toggleChat() {
//         chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
//     }

//     // Send chat query
//     function sendChatMessage() {
//         let inputField = document.getElementById("chat-input");
//         let query = inputField.value.trim();
//         if (!query) return;
//         addMessage(query, "user");
//         inputField.value = "";
//         askGemini(query, "");
//     }

//     // Summarize the page
//     function summarizePage() {
//         let pageText = document.body.innerText;
//         addMessage("Summarizing the page...", "bot");
//         askGemini("Summarize this page:", pageText);
//     }

//     // Fetch AI response
//     function askGemini(userMessage, pageText) {
//         let apiKey = "AIzaSyCwdDvKqc-W9Ucmve5tU2OemneMPvymVEA";  // Replace with your actual key
//         let apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
//         let requestBody = {
//             contents: [{
//                 parts: [
//                     { text: `User Question: ${userMessage}\n\nWebpage Content: ${pageText}\n\nAnswer:` }
//                 ]
//             }]
//         };
    
//         fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(requestBody)
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.candidates && data.candidates.length > 0) {
//                 addMessage(data.candidates[0].content.parts[0].text, "bot");
//             } else {
//                 addMessage("I couldn't generate a response. Try again!", "bot");
//             }
//         })
//         .catch(error => {
//             addMessage("Error connecting to AI.", "bot");
//             console.error("API Error:", error);
//         });
//     }

//     // Add messages to chat
//     function addMessage(text, sender) {
//         let chatBox = document.getElementById("ai-chat-box");
//         let messageDiv = document.createElement("div");
//         messageDiv.classList.add("message", sender);
//         messageDiv.innerText = text;
//         chatBox.appendChild(messageDiv);
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }

//     // Generate mind map
//     function generateMindMap() {
//         let summary = document.getElementById("ai-chat-box").innerText;
//         let mindMapData = `graph TD; A[Summary] -->|Key Points| B(${summary.replace(/\n/g, ";")})`;
//         let mindMapContainer = document.getElementById("mindmap-container");
//         mindMapContainer.innerHTML = `<pre class="mermaid">${mindMapData}</pre>`;
//         mermaid.init(undefined, mindMapContainer);
//     }

// })();

// // Load Mermaid.js if not already present
// if (!document.getElementById("mermaidScript")) {
//     let script = document.createElement("script");
//     script.id = "mermaidScript";
//     script.src = "https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.2.0/mermaid.min.js";
//     document.body.appendChild(script);
//     script.onload = () => mermaid.initialize({ startOnLoad: false });
// }
