// (function() {
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
//         <button id="generate-mindmap">🧠 Generate Mind Map</button>
//         <div id="mindmap-container"></div>
//     `;
//     document.body.appendChild(chatContainer);

//     // Close chat button
//     document.getElementById("close-chat").addEventListener("click", () => {
//         chatContainer.style.display = "none";
//     });

//     // Event listeners
//     document.getElementById("send-chat").addEventListener("click", sendChatMessage);
//     document.getElementById("chat-input").addEventListener("keypress", (e) => {
//         if (e.key === "Enter") sendChatMessage();
//     });
//     document.getElementById("generate-mindmap").addEventListener("click", generateMindMap);

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
//         askGemini(query, document.body.innerText);
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




// (function () {
//     if (document.getElementById("ai-chat-toggle")) return;

//     // Inject Chat Toggle Button
//     let button = document.createElement("div");
//     button.id = "ai-chat-toggle";
//     button.innerText = "💬";
//     button.style = "position: fixed; bottom: 20px; right: 20px; background: #0078ff; color: white; padding: 10px; border-radius: 50%; cursor: pointer; font-size: 20px; z-index: 9999;";
//     button.onclick = toggleChat;
//     document.body.appendChild(button);

//     // Chat Container
// let chatContainer = document.createElement("div");
// chatContainer.id = "ai-chat-container";
// chatContainer.style = `
//     position: fixed; 
//     bottom: 80px; 
//     right: 20px; 
//     width: 300px; 
//     max-height: 500px; /* Ensures the chat box doesn't overflow */
//     background: white; 
//     border-radius: 8px; 
//     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
//     display: none; 
//     flex-direction: column; 
//     z-index: 10000;
//     overflow: hidden;
// `;
// chatContainer.innerHTML = `
//     <div id="ai-chat-header" style="background: #0078ff; color: white; padding: 10px; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
//         <span>AI Chat</span>
//         <button id="close-chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer;">✖</button>
//     </div>
    
//     <!-- Scrollable Chat Box -->
//     <div id="ai-chat-box" style="flex-grow: 1; max-height: 250px; overflow-y: auto; padding: 10px; border-bottom: 1px solid #ddd;"></div>

//     <!-- Input Section -->
//     <div id="ai-chat-input" style="display: flex; padding: 10px; border-top: 1px solid #ddd;">
//         <input type="text" id="chat-input" placeholder="Ask something..." style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//         <button id="send-chat" style="margin-left: 5px; background: #0078ff; color: white; border: none; padding: 8px; cursor: pointer;">➤</button>
//     </div>

//     <!-- Generate Mind Map Button -->
//     <button id="generate-mindmap" style="width: 100%; padding: 10px; border: none; background: #28a745; color: white; cursor: pointer; font-size: 14px;">🧠 Generate Mind Map</button>

//     <!-- Scrollable Mind Map Container -->
//     <div id="mindmap-container" style="max-height: 200px; overflow-y: auto; padding: 10px;"></div>
// `;

// document.body.appendChild(chatContainer);

//     // Event Listeners
//     document.getElementById("close-chat").addEventListener("click", () => chatContainer.style.display = "none");
//     document.getElementById("send-chat").addEventListener("click", sendChatMessage);
//     document.getElementById("chat-input").addEventListener("keypress", (e) => {
//         if (e.key === "Enter") sendChatMessage();
//     });
//     document.getElementById("generate-mindmap").addEventListener("click", renderMindMap);

//     function toggleChat() {
//         chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
//     }

//     function sendChatMessage() {
//         let inputField = document.getElementById("chat-input");
//         let query = inputField.value.trim();
//         if (!query) return;
//         addMessage(query, "user");
//         inputField.value = "";
//         askGemini(query);
//     }
// // Fetch AI response
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

//     function addMessage(text, sender) {
//         let chatBox = document.getElementById("ai-chat-box");
//         let messageDiv = document.createElement("div");
//         messageDiv.classList.add("message", sender);
//         messageDiv.style = `padding: 5px; border-radius: 5px; margin: 5px 0; ${sender === "user" ? "background: #0078ff; color: white; text-align: right;" : "background: #f1f1f1; text-align: left;"}`;
//         messageDiv.innerText = text;
//         chatBox.appendChild(messageDiv);
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }

//     function () {
//         function renderMindMap() {
//             let mindMapData = generateMindMap();
//             let mindMapContainer = document.getElementById("mindmap-container");
    
//             if (!mindMapContainer) {
//                 console.error("Mindmap container not found.");
//                 return;
//             }
    
//             mindMapContainer.innerHTML = `<pre class="mermaid">${mindMapData}</pre>`;
    
//             if (typeof mermaid !== "undefined") {
//                 mermaid.init(undefined, mindMapContainer);
//             } else {
//                 console.warn("Mermaid.js not loaded. Loading now...");
//                 loadMermaid(() => mermaid.init(undefined, mindMapContainer));
//             }
//         }
    
//         function generateMindMap() {
//             let elements = document.querySelectorAll("h1, h2, h3, button, a, input, img, section, div");
//             let structure = "graph TD;\n  root[Website] -->|Elements| section;\n";
    
//             elements.forEach((el, index) => {
//                 let tag = el.tagName.toLowerCase();
//                 let label = el.innerText.trim() || el.getAttribute("alt") || tag;
//                 label = label.length > 30 ? label.substring(0, 27) + "..." : label; // Shorten label
    
//                 structure += `  section -->|${tag}| node${index}["${label}"];\n`;
//             });
    
//             return structure;
//         }
    
//         function loadMermaid(callback) {
//             if (!document.getElementById("mermaidScript")) {
//                 let script = document.createElement("script");
//                 script.id = "mermaidScript";
//                 script.src = "https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.2.0/mermaid.min.js";
//                 script.onload = () => {
//                     mermaid.initialize({ startOnLoad: false });
//                     console.log("Mermaid.js loaded successfully.");
//                     if (callback) callback();
//                 };
//                 document.body.appendChild(script);
//             } else {
//                 console.log("Mermaid.js already loaded.");
//                 if (callback) callback();
//             }
//         }
    
//         document.addEventListener("DOMContentLoaded", () => {
//             loadMermaid(renderMindMap);
//         });
//     })();


(function () {
    if (document.getElementById("ai-chat-toggle")) return;

    // Inject Chat Toggle Button
    let button = document.createElement("div");
    button.id = "ai-chat-toggle";
    button.innerText = "💬";
    button.style = `
        position: fixed; bottom: 20px; right: 20px;
        background: #0078ff; color: white;
        padding: 10px; border-radius: 50%;
        cursor: pointer; font-size: 20px;
        z-index: 9999;
    `;
    button.onclick = toggleChat;
    document.body.appendChild(button);

    // Chat Container
    let chatContainer = document.createElement("div");
    chatContainer.id = "ai-chat-container";
    chatContainer.style = `
        position: fixed; bottom: 80px; right: 20px;
        width: 300px; max-height: 500px;
        background: white; border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        display: none; flex-direction: column;
        z-index: 10000; overflow: hidden;
    `;
    chatContainer.innerHTML = `
        <div id="ai-chat-header" style="background: #0078ff; color: white; padding: 10px; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
            <span>AI Chat</span>
            <button id="close-chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer;">✖</button>
        </div>
        <div id="ai-chat-box" style="flex-grow: 1; max-height: 250px; overflow-y: auto; padding: 10px; border-bottom: 1px solid #ddd;"></div>
        <div id="ai-chat-input" style="display: flex; padding: 10px; border-top: 1px solid #ddd;">
            <input type="text" id="chat-input" placeholder="Ask something..." style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <button id="send-chat" style="margin-left: 5px; background: #0078ff; color: white; border: none; padding: 8px; cursor: pointer;">➤</button>
        </div>
        <button id="generate-mindmap" style="width: 100%; padding: 10px; border: none; background: #28a745; color: white; cursor: pointer; font-size: 14px;">🧠 Generate Mind Map</button>
        <div id="mindmap-container" style="max-height: 200px; overflow-y: auto; padding: 10px;"></div>
    `;
    document.body.appendChild(chatContainer);

    // Event Listeners
    document.getElementById("close-chat").addEventListener("click", () => chatContainer.style.display = "none");
    document.getElementById("send-chat").addEventListener("click", sendChatMessage);
    document.getElementById("chat-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendChatMessage();
    });
    document.getElementById("generate-mindmap").addEventListener("click", renderMindMap);

    function toggleChat() {
        chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
    }

    function sendChatMessage() {
        let inputField = document.getElementById("chat-input");
        let query = inputField.value.trim();
        if (!query) return;
        addMessage(query, "user");
        inputField.value = "";
        askGemini(query);
    }

    // Fetch AI response
    function askGemini(userMessage) {
        let apiKey = "YOUR_API_KEY_HERE"; // Replace with your secure key
        let apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        let requestBody = {
            contents: [{
                parts: [{ text: `User Question: ${userMessage}\n\nAnswer:` }]
            }]
        };

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            let botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Try again!";
            addMessage(botResponse, "bot");
        })
        .catch(error => {
            addMessage("Error connecting to AI.", "bot");
            console.error("API Error:", error);
        });
    }

    function addMessage(text, sender) {
        let chatBox = document.getElementById("ai-chat-box");
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.style = `
            padding: 5px; border-radius: 5px; margin: 5px 0;
            ${sender === "user" ? "background: #0078ff; color: white; text-align: right;" : "background: #f1f1f1; text-align: left;"}
        `;
        messageDiv.innerText = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function renderMindMap() {
        let mindMapData = generateMindMap();
        let mindMapContainer = document.getElementById("mindmap-container");

        if (!mindMapContainer) {
            console.error("Mindmap container not found.");
            return;
        }

        mindMapContainer.innerHTML = `<pre class="mermaid">${mindMapData}</pre>`;

        if (typeof mermaid !== "undefined") {
            mermaid.init(undefined, mindMapContainer);
        } else {
            console.warn("Mermaid.js not loaded. Loading now...");
            loadMermaid(() => mermaid.init(undefined, mindMapContainer));
        }
    }

    // function generateMindMap() {
    //     let elements = document.querySelectorAll("button, a, input");
    //     let structure = "graph TD;\n  root[Website] -->|Elements| section;\n";

    //     elements.forEach((el, index) => {
    //         let tag = el.tagName.toLowerCase();
    //         let label = el.innerText.trim() || el.getAttribute("alt") || tag;
    //         label = label.length > 30 ? label.substring(0, 27) + "..." : label; // Shorten label

    //         structure += `  section -->|${tag}| node${index}["${label}"];\n`;
    //     });

    //     return structure;
    // }

    function generateMindMap() {
        let elements = document.querySelectorAll("button, a, input");
        let structure = "graph TD;\n  root[Website] -->|Elements| section;\n";
    
        elements.forEach((el, index) => {
            let tag = el.tagName.toLowerCase();
            let label = el.innerText.trim() || el.getAttribute("alt") || tag;
            let href = el.tagName === "A" ? el.getAttribute("href") : null; // Extract link for <a> tags
            
            label = label.length > 30 ? label.substring(0, 27) + "..." : label; // Shorten long labels
    
            structure += `  section -->|${tag}| node${index}["${label}"];\n`;
    
            // If it's an <a> tag with a valid href, add a clickable link in Mermaid
            if (href) {
                structure += ` node${index} "${href}" \n`;
            }

        });
    
        return structure;
    }
    

    function loadMermaid(callback) {
        if (!document.getElementById("mermaidScript")) {
            let script = document.createElement("script");
            script.id = "mermaidScript";
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.2.0/mermaid.min.js";
            script.onload = () => {
                mermaid.initialize({ startOnLoad: false });
                console.log("Mermaid.js loaded successfully.");
                if (callback) callback();
            };
            document.body.appendChild(script);
        } else {
            console.log("Mermaid.js already loaded.");
            if (callback) callback();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        loadMermaid(renderMindMap);
    });
})();
