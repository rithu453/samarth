// (function() {
//     // Prevent multiple initializations
//     if (document.getElementById("ai-chat-toggle")) return;

//     // Configuration
//     const config = {
//         colors: {
//             primary: "#0078ff",
//             secondary: "#28a745",
//             background: "#ffffff",
//             lightGray: "#f1f1f1"
//         },
//         apiEndpoints: {
//             // gemini: "https://localhost:8000/gemini",
//             mindMap: "https://localhost:8000/extract"
//         }
//     };

    

//     // Create and append chat UI
//     function initializeChatUI() {
//         // Inject Chat Toggle Button
//         const button = document.createElement("div");
//         button.id = "ai-chat-toggle";
//         button.setAttribute("aria-label", "Open AI Chat");
//         button.setAttribute("role", "button");
//         button.setAttribute("tabindex", "0");
//         button.innerText = "💬";
//         button.style = `
//             position: fixed; bottom: 20px; right: 20px;
//             background: ${config.colors.primary}; color: white;
//             padding: 15px; border-radius: 80px;
//             cursor: pointer; font-size: 24px;
//             z-index: 9999; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
//             display: flex; align-items: center; justify-content: center;
//             width: 50px; height: 50px; transition: all 0.3s ease;
//         `;
//         document.body.appendChild(button);

//         // Chat Container
//         const chatContainer = document.createElement("div");
//         chatContainer.id = "ai-chat-container";
//         chatContainer.style = `
//             position: fixed; bottom: 80px; right: 30px;
//             width: 500px; max-height: 700px;
//             background: ${config.colors.background}; border-radius: 12px;
//             box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
//             display: none; flex-direction: column;
//             z-index: 10000; overflow: hidden;
//             font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
//         `;
        
//         chatContainer.innerHTML = `
//             <div id="ai-chat-header" style="background: ${config.colors.primary}; color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
//                 <span>Samarth</span>
//                 <button id="close-chat" aria-label="Close chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 4px 8px;">✖</button>
//             </div>
//             <div id="ai-chat-box" style="flex-grow: 1; height: 300px; overflow-y: auto; padding: 16px; background: #f9f9f9; scroll-behavior: smooth;"></div>
//             <div id="ai-chat-input" style="display: flex; padding: 12px; border-top: 1px solid #eee; background: white;">
//                 <input type="text" id="chat-input" placeholder="Ask something..." aria-label="Type your message" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; outline: none;">
//                 <button id="send-chat" aria-label="Send message" style="margin-left: 8px; background: ${config.colors.primary}; color: white; border: none; border-radius: 6px; padding: 0 16px; cursor: pointer; transition: background 0.2s;">➤</button>
//             </div>
//             <button id="generate-mindmap" aria-label="Generate mind map" style="width: 100%; padding: 12px; border: none; background: ${config.colors.secondary}; color: white; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s;">🧠 Generate Mind Map</button>
//             <div id="mindmap-container" style="max-height: 200px; overflow-y: auto; padding: 16px; background: #f9f9f9; border-top: 1px solid #eee; display: none;"></div>
//         `;
        
//         document.body.appendChild(chatContainer);
//     }

//     // Add this to your content.js file if it's missing
// function addMessage(text, sender) {
//     const chatBox = document.getElementById("ai-chat-box");
//     const messageDiv = document.createElement("div");
//     messageDiv.classList.add("message", sender);
    
//     // Style based on sender
//     const isUser = sender === "user";
//     messageDiv.style = `
//         padding: 10px 14px;
//         border-radius: 14px;
//         margin: 8px 0;
//         max-width: 80%;
//         line-height: 1.4;
//         word-wrap: break-word;
//         ${isUser 
//             ? `background: ${config.colors.primary}; color: white; margin-left: auto; border-bottom-right-radius: 4px;` 
//             : `background: white; color: #333; margin-right: auto; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);`}
//     `;
    
//     // Format message text (simple markdown-like parsing)
//     text = formatMessageText(text);
    
//     messageDiv.innerHTML = text;
//     chatBox.appendChild(messageDiv);
    
//     // Auto scroll to bottom
//     chatBox.scrollTop = chatBox.scrollHeight;
// }

//     // Add event listeners
//     function setupEventListeners() {
//         const chatToggle = document.getElementById("ai-chat-toggle");
//         const closeChat = document.getElementById("close-chat");
//         const sendButton = document.getElementById("send-chat");
//         const chatInput = document.getElementById("chat-input");
//         const generateButton = document.getElementById("generate-mindmap");

//         chatToggle.addEventListener("click", toggleChat);
//         chatToggle.addEventListener("keydown", (e) => {
//             if (e.key === "Enter" || e.key === " ") toggleChat();
//         });
        
//         closeChat.addEventListener("click", () => {
//             document.getElementById("ai-chat-container").style.display = "none";
//         });
        
//         sendButton.addEventListener("click", sendChatMessage);
        
//         chatInput.addEventListener("keypress", (e) => {
//             if (e.key === "Enter") sendChatMessage();
//         });
        
//         generateButton.addEventListener("click", renderMindMap);
//     }

//     // Toggle chat visibility
//     function toggleChat() {
//         const chatContainer = document.getElementById("ai-chat-container");
//         const isVisible = chatContainer.style.display !== "none";
        
//         chatContainer.style.display = isVisible ? "none" : "flex";
        
//         if (!isVisible) {
//             document.getElementById("chat-input").focus();
            
//             // Add welcome message if chat is empty
//             const chatBox = document.getElementById("ai-chat-box");
//             if (chatBox.childNodes.length === 0) {
//                 addMessage("Hello! How can I help you today?", "bot");
//             }
//         }
//     }

//     // Send user message and get AI response
//     function sendChatMessage() {
//         const inputField = document.getElementById("chat-input");
//         const query = inputField.value.trim();
        
//         if (!query) return;
        
//         addMessage(query, "user");
//         inputField.value = "";
        
//         // Show typing indicator
//         showTypingIndicator();
        
//         // Get AI response
//         askGemini(query)
//             .finally(() => {
//                 removeTypingIndicator();
//             });
//     }

//     // Show typing indicator
//     function showTypingIndicator() {
//         const chatBox = document.getElementById("ai-chat-box");
//         const indicator = document.createElement("div");
//         indicator.id = "typing-indicator";
//         indicator.style = `
//             padding: 8px 12px;
//             background: #f1f1f1;
//             border-radius: 12px;
//             margin: 5px 0;
//             width: fit-content;
//             display: flex;
//             align-items: center;
//         `;
        
//         // Add animated dots
//         for (let i = 0; i < 3; i++) {
//             const dot = document.createElement("div");
//             dot.style = `
//                 height: 8px;
//                 width: 8px;
//                 background: #888;
//                 border-radius: 50%;
//                 margin: 0 2px;
//                 opacity: 0.7;
//                 animation: pulse 1.5s infinite ease-in-out;
//                 animation-delay: ${i * 0.2}s;
//             `;
//             indicator.appendChild(dot);
//         }
        
//         // Add animation style
//         if (!document.getElementById("typing-animation")) {
//             const style = document.createElement("style");
//             style.id = "typing-animation";
//             style.textContent = `
//                 @keyframes pulse {
//                     0%, 100% { transform: scale(1); }
//                     50% { transform: scale(1.2); }
//                 }
//             `;
//             document.head.appendChild(style);
//         }
        
//         chatBox.appendChild(indicator);
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }

//     // Remove typing indicator
//     function removeTypingIndicator() {
//         const indicator = document.getElementById("typing-indicator");
//         if (indicator) {
//             indicator.remove();
//         }
//     }

   
//     // Global variable to store the mind map data
// let currentMindMapData = null;

// // // Modified renderMindMap function to store the mind map data
// // async function renderMindMap() {
// //     const url = window.location.href;
// //     console.log("Current URL:", url);

// //     // Show mind map container
// //     const mindMapContainer = document.getElementById("mindmap-container");
// //     mindMapContainer.style.display = "block";
    
// //     // Get and disable button
// //     const generateButton = document.getElementById("generate-mindmap");
// //     generateButton.disabled = true;
// //     generateButton.innerText = "⏳ May take upto 2 minutes";
// //     generateButton.style.opacity = "0.7";
    
// //     try {
// //         const response = await sendMindMapToApi(url);
// //         console.log("Mind Map API Response:", response);
    
// //         if (response.mindmap) {  // Check if mindmap exists
// //             currentMindMapData = response.mindmap;
    
// //             // Format the mindmap for display
// //             const formattedMindMap = response.mindmap
// //                 .split("\n")  // Convert to an array of lines
// //                 .map(line => `<li>  ${line}</li>`)  // Wrap each line in a list item
// //                 .join("");  // Convert back to a string
    
// //             // Display the mind map properly inside a <ul>
// //             mindMapContainer.innerHTML = `
// //                 <ul style="padding-left: 16px;">${formattedMindMap}</ul>
// //             `;
// //         } else {
// //             currentMindMapData = null;
// //             mindMapContainer.innerHTML = `<p style="color: red;">❌ Error: Failed to generate mind map.</p>`;
// //         }
// //     } catch (error) {
// //         console.error("Mind Map API error:", error);
// //         currentMindMapData = null;
// //         mindMapContainer.innerHTML = `<p style="color: red;">❌ Connection Error: ${error.message || "Failed to connect to API service."}</p>`;
// //     } finally {
// //         generateButton.disabled = false;
// //         generateButton.innerText = "🧠 Generate Mind Map";
// //         generateButton.style.opacity = "1";
// //     }
    
    
// // }

// // Modified renderMindMap function to automatically create and display a Mermaid mindmap
// async function renderMindMap() {
//     const url = window.location.href;
//     console.log("Current URL:", url);
    
//     // Show mind map container
//     const mindMapContainer = document.getElementById("mindmap-container");
//     mindMapContainer.style.display = "block";
    
//     // Get and disable button
//     const generateButton = document.getElementById("generate-mindmap");
//     generateButton.disabled = true;
//     generateButton.innerText = "⏳ May take upto 2 minutes";
//     generateButton.style.opacity = "0.7";
    
//     // Make sure Mermaid is loaded
//     if (typeof mermaid === 'undefined') {
//         // Dynamically load Mermaid if not already loaded
//         const script = document.createElement('script');
//         script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
//         script.onload = function() {
//             // Once loaded, initialize and continue
//             mermaid.initialize({
//                 startOnLoad: false,
//                 theme: 'default',
//                 securityLevel: 'loose'
//             });
//             proceedWithMindMap();
//         };
//         script.onerror = function() {
//             mindMapContainer.innerHTML = `<p style="color: red;">❌ Error: Failed to load Mermaid.js library.</p>`;
//             resetButton();
//         };
//         document.head.appendChild(script);
//     } else {
//         // If Mermaid is already loaded, proceed directly
//         proceedWithMindMap();
//     }
    
//     async function proceedWithMindMap() {
//         try {
//             const response = await sendMindMapToApi(url);
//             console.log("Mind Map API Response:", response);
            
//             if (response.mindmap) {
//                 currentMindMapData = response.mindmap;
                
//                 // Convert the text-based mind map to Mermaid syntax
//                 const mermaidMindMap = convertToMermaidMindMap(currentMindMapData);
                
//                 // Create a unique ID for the mermaid diagram
//                 const mermaidDivId = "mermaid-diagram-" + Date.now();
                
//                 // Create container for the mermaid diagram
//                 mindMapContainer.innerHTML = `<div class="mermaid" id="${mermaidDivId}">${mermaidMindMap}</div>`;
                
//                 // Render the diagram
//                 mermaid.render(mermaidDivId, mermaidMindMap).then(({ svg }) => {
//                     document.getElementById(mermaidDivId).innerHTML = svg;
//                 }).catch(err => {
//                     console.error("Mermaid rendering error:", err);
//                     mindMapContainer.innerHTML = `
//                         <p style="color: red;">❌ Error rendering mindmap: ${err.message}</p>
//                         <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;">
//                             ${mermaidMindMap}
//                         </pre>
//                     `;
//                 });
//             } else {
//                 currentMindMapData = null;
//                 mindMapContainer.innerHTML = `<p style="color: red;">❌ Error: Failed to generate mind map.</p>`;
//             }
//         } catch (error) {
//             console.error("Mind Map API error:", error);
//             currentMindMapData = null;
//             mindMapContainer.innerHTML = `<p style="color: red;">❌ Connection Error: ${error.message || "Failed to connect to API service."}</p>`;
//         } finally {
//             resetButton();
//         }
//     }
    
//     function resetButton() {
//         generateButton.disabled = false;
//         generateButton.innerText = "🧠 Generate Mind Map";
//         generateButton.style.opacity = "1";
//     }
// }

// // Function to convert text-based mind map to Mermaid mindmap syntax
// function convertToMermaidMindMap(textMindMap) {
//     // Split the mindmap into lines
//     const lines = textMindMap.split('\n');
    
//     // Start with the mindmap header
//     let mermaidSyntax = 'mindmap\n';
    
//     // Process lines to determine hierarchy
//     const nodes = [];
//     const parentMap = {};
    
//     // Parse the indentation to build a tree structure
//     let prevIndentLevel = -1;
//     let prevNodeId = null;
//     let parentStack = [];
    
//     for (let i = 0; i < lines.length; i++) {
//         const line = lines[i];
//         if (!line.trim()) continue; // Skip empty lines
        
//         // Calculate indentation level (number of spaces at beginning)
//         const indentMatch = line.match(/^(\s*)/);
//         const indentLevel = indentMatch ? indentMatch[1].length / 2 : 0;
        
//         // Clean the node text
//         const nodeText = line.trim().replace(/^[-*•]+\s*/, '');
//         if (!nodeText) continue;
        
//         // Create a unique ID for this node
//         const nodeId = `node_${i}`;
        
//         // Determine parent based on indentation
//         if (indentLevel > prevIndentLevel) {
//             // This is a child of the previous node
//             if (prevNodeId) {
//                 parentStack.push(prevNodeId);
//                 parentMap[nodeId] = prevNodeId;
//             }
//         } else if (indentLevel < prevIndentLevel) {
//             // Go back up the tree
//             const levelsToGoUp = prevIndentLevel - indentLevel;
//             for (let j = 0; j < levelsToGoUp; j++) {
//                 parentStack.pop();
//             }
//             parentMap[nodeId] = parentStack.length > 0 ? parentStack[parentStack.length - 1] : null;
//         } else {
//             // Same level as previous node (sibling)
//             parentMap[nodeId] = parentStack.length > 0 ? parentStack[parentStack.length - 1] : null;
//         }
        
//         // Store the node
//         nodes.push({
//             id: nodeId,
//             text: nodeText,
//             level: indentLevel
//         });
        
//         prevIndentLevel = indentLevel;
//         prevNodeId = nodeId;
//     }
    
//     // Build the Mermaid syntax
//     if (nodes.length > 0) {
//         // Root node
//         const rootNode = nodes[0];
//         mermaidSyntax += `  root((${escapeSpecialChars(rootNode.text)}))\n`;
        
//         // Add all other nodes with their relationships
//         for (let i = 1; i < nodes.length; i++) {
//             const node = nodes[i];
//             const parent = parentMap[node.id] || 'root';
            
//             // Use --> for parent-child relationship
//             mermaidSyntax += `  ${parent} --> ${node.id}(${escapeSpecialChars(node.text)})\n`;
//         }
//     }
    
//     return mermaidSyntax;
// }

// // Escape special characters that might break Mermaid syntax
// function escapeSpecialChars(text) {
//     return text
//         .replace(/"/g, '\\"')
//         .replace(/\(/g, '\\(')
//         .replace(/\)/g, '\\)')
//         .replace(/:/g, '\\:');
// }

// async function askGemini(query, retryCount = 3, delay = 1000) {
//     const apiUrl = "https://localhost:8000/gemini"; // API route

//     const requestBody = {
//         query: query, 
//         mindmap: currentMindMapData 
//     };

//     try {
//         // Send request to backend
//         const response = await fetch(apiUrl, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(requestBody),
//         });

//         // Handle rate-limiting (429)
//         if (response.status === 429 && retryCount > 0) {
//             console.warn("Rate limited! Retrying in", delay, "ms");
//             await new Promise(resolve => setTimeout(resolve, delay));
//             return askGemini(query, retryCount - 1, delay * 2); // Exponential backoff
//         }

//         if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

//         const data = await response.json();
//         console.log(data);
        
//         // Extract and display the chatbot response
//         const botResponse = data || "I couldn't generate a response. Please try again.";
//         addMessage(botResponse, "bot");

//     } catch (error) {
//         console.error("Gemini API Error:", error);
//         addMessage("❌ Error: Unable to connect to AI. Please try again later.", "bot");
//     }
// }



// // Function to format message text (supports basic markdown-like syntax)
// function formatMessageText(text) {
//     return text
//         .replace(/\*(.*?)\*/g, "<strong>$1</strong>") // Bold: *text*
//         .replace(/_(.*?)_/g, "<em>$1</em>") // Italic: _text_
//         .replace(/`(.*?)`/g, "<code>$1</code>"); // Inline code: `text`
// }

//     // Truncate URL for display
//     function truncateUrl(url, maxLength) {
//         if (url.length <= maxLength) return url;
//         return url.substring(0, maxLength) + '...';
//     }

//     // Send URL to backend API ...any url
//     async function sendMindMapToApi(url) {
//         try {
//             const response = await fetch(config.apiEndpoints.mindMap, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ url: url }),
//             });

//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status} ${response.statusText}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error("Mind Map API error:", error);
//             throw error;
//         }
//     }

//     // Initialize the chat interface
//     function initialize() {
//         initializeChatUI();
//         setupEventListeners();
//         console.log("✅ AI Chat interface initialized successfully");
//     }

//     // Start initialization
//     initialize();
// })();

// document.addEventListener("DOMContentLoaded", () => {
//     // Load Mermaid.js locally
//     const script = document.createElement("script");
//     script.src = chrome.runtime.getURL("mermaid.min.js");
//     script.onload = () => console.log("Mermaid.js loaded from local storage!");
//     document.head.appendChild(script);

//     // Mind Map UI Elements
//     const generateButton = document.getElementById("generate-mind-map");
//     if (!generateButton) return; // Prevent errors if button doesn't exist

//     let mindMapContainer = document.createElement("div");
//     mindMapContainer.id = "mind-map-container";
//     mindMapContainer.style.display = "none"; // Initially hidden
//     mindMapContainer.style.position = "fixed";
//     mindMapContainer.style.top = "10%";
//     mindMapContainer.style.left = "10%";
//     mindMapContainer.style.width = "80%";
//     mindMapContainer.style.height = "80%";
//     mindMapContainer.style.background = "white";
//     mindMapContainer.style.border = "1px solid black";
//     mindMapContainer.style.padding = "20px";
//     mindMapContainer.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
//     document.body.appendChild(mindMapContainer);

//     generateButton.addEventListener("click", () => {
//         console.log("Generating mind map...");
//         const showButton = document.createElement("button");
//         showButton.innerText = "Show Mind Map";
//         showButton.style.margin = "10px";
//         showButton.addEventListener("click", () => {
//             mindMapContainer.style.display = "block";
//         });

//         if (!document.getElementById("show-mind-map")) {
//             showButton.id = "show-mind-map";
//             document.body.appendChild(showButton);
//         }
//     });

//     const closeButton = document.createElement("button");
//     closeButton.innerText = "Close";
//     closeButton.style.position = "absolute";
//     closeButton.style.top = "10px";
//     closeButton.style.right = "10px";
//     closeButton.addEventListener("click", () => {
//         mindMapContainer.style.display = "none";
//     });
//     mindMapContainer.appendChild(closeButton);
// });


//second
// (function() {
//     // Prevent multiple initializations
//     if (document.getElementById("ai-chat-toggle")) return;

//     // Configuration
//     const config = {
//         colors: {
//             primary: "#0078ff",
//             secondary: "#28a745",
//             background: "#ffffff",
//             lightGray: "#f1f1f1"
//         },
//         apiEndpoints: {
//             chat: "https://localhost:8000/gemini",
//             mindMap: "https://localhost:8000/extract"
//         }
//     };

//     // Create and append chat UI
//     function initializeChatUI() {
//         // Inject Chat Toggle Button
//         const button = document.createElement("div");
//         button.id = "ai-chat-toggle";
//         button.setAttribute("aria-label", "Open AI Chat");
//         button.setAttribute("role", "button");
//         button.setAttribute("tabindex", "0");
//         button.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//         </svg>`;
//         button.style = `
//             position: fixed; bottom: 20px; right: 20px;
//             background: ${config.colors.primary}; color: white;
//             padding: 15px; border-radius: 50%;
//             cursor: pointer; font-size: 24px;
//             z-index: 9999; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
//             display: flex; align-items: center; justify-content: center;
//             width: 50px; height: 50px; transition: all 0.3s ease;
//         `;
//         document.body.appendChild(button);

//         // Chat Container
//         const chatContainer = document.createElement("div");
//         chatContainer.id = "ai-chat-container";
//         chatContainer.style = `
//             position: fixed; bottom: 80px; right: 30px;
//             width: 380px; max-height: 600px;
//             background: ${config.colors.background}; border-radius: 12px;
//             box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
//             display: none; flex-direction: column;
//             z-index: 10000; overflow: hidden;
//             font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
//             transition: all 0.3s ease;
//         `;
        
//         chatContainer.innerHTML = `
//             <div id="ai-chat-header" style="background: ${config.colors.primary}; color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
//                 <span>Samarth</span>
//                 <div>
//                     <button id="minimize-chat" aria-label="Minimize chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 4px 8px; margin-right: 4px;">_</button>
//                     <button id="close-chat" aria-label="Close chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 4px 8px;">✖</button>
//                 </div>
//             </div>
//             <div id="ai-chat-box" style="flex-grow: 1; height: 320px; overflow-y: auto; padding: 16px; background: #f9f9f9; scroll-behavior: smooth;"></div>
//             <div id="ai-chat-input" style="display: flex; padding: 12px; border-top: 1px solid #eee; background: white;">
//                 <textarea id="chat-input" placeholder="Ask something..." aria-label="Type your message" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; outline: none; resize: none; min-height: 40px; max-height: 120px;"></textarea>
//                 <button id="send-chat" aria-label="Send message" style="margin-left: 8px; background: ${config.colors.primary}; color: white; border: none; border-radius: 6px; padding: 0 16px; cursor: pointer; transition: background 0.2s;">
//                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                         <path d="M22 2L11 13M22 2L15 22l-4-9-9-4L22 2z"></path>
//                     </svg>
//                 </button>
//             </div>
//             <button id="generate-mindmap" aria-label="Generate mind map" style="width: 100%; padding: 12px; border: none; background: ${config.colors.secondary}; color: white; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s;">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
//                     <circle cx="12" cy="12" r="10"></circle>
//                     <path d="M12 16v-4"></path>
//                     <path d="M12 8h.01"></path>
//                 </svg>
//                 Generate Mind Map
//             </button>
//             <div id="mindmap-container" style="max-height: 300px; overflow-y: auto; padding: 16px; background: #f9f9f9; border-top: 1px solid #eee; display: none;"></div>
//         `;
        
//         document.body.appendChild(chatContainer);
        
//         // Add styles for auto-expanding textarea
//         const style = document.createElement('style');
//         style.textContent = `
//             #chat-input {
//                 overflow-y: hidden;
//                 transition: height 0.1s ease;
//             }
//             @keyframes pulse {
//                 0%, 100% { transform: scale(1); opacity: 0.7; }
//                 50% { transform: scale(1.2); opacity: 1; }
//             }
//             .message {
//                 animation: fadeIn 0.3s ease;
//             }
//             @keyframes fadeIn {
//                 from { opacity: 0; transform: translateY(10px); }
//                 to { opacity: 1; transform: translateY(0); }
//             }
//             .mermaid svg {
//                 max-width: 100%;
//                 height: auto;
//             }
//         `;
//         document.head.appendChild(style);
//     }

//     // Add message to chat
//     function addMessage(text, sender) {
//         const chatBox = document.getElementById("ai-chat-box");
//         const messageDiv = document.createElement("div");
//         messageDiv.classList.add("message", sender);
        
//         // Style based on sender
//         const isUser = sender === "user";
//         messageDiv.style = `
//             padding: 10px 14px;
//             border-radius: 14px;
//             margin: 8px 0;
//             max-width: 85%;
//             line-height: 1.4;
//             word-wrap: break-word;
//             ${isUser 
//                 ? `background: ${config.colors.primary}; color: white; margin-left: auto; border-bottom-right-radius: 4px;` 
//                 : `background: white; color: #333; margin-right: auto; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);`}
//         `;
        
//         // Format message text (simple markdown-like parsing)
//         text = formatMessageText(text);
        
//         messageDiv.innerHTML = text;
//         chatBox.appendChild(messageDiv);
        
//         // Auto scroll to bottom
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }

//     // Format message text with markdown support
//     function formatMessageText(text) {
//         return text
//             .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold: **text**
//             .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic: *text*
//             .replace(/`(.*?)`/g, "<code style='background:#f0f0f0;padding:2px 4px;border-radius:3px;font-family:monospace;'>$1</code>") // Inline code: `text`
//             .replace(/```(.*?)```/gs, "<pre style='background:#f0f0f0;padding:8px;border-radius:4px;overflow-x:auto;font-family:monospace;'>$1</pre>") // Code block: ```text```
//             .replace(/\n/g, "<br>"); // Line breaks
//     }

//     // Set up event listeners
//     function setupEventListeners() {
//         const chatToggle = document.getElementById("ai-chat-toggle");
//         const closeChat = document.getElementById("close-chat");
//         const minimizeChat = document.getElementById("minimize-chat");
//         const sendButton = document.getElementById("send-chat");
//         const chatInput = document.getElementById("chat-input");
//         const generateButton = document.getElementById("generate-mindmap");

//         chatToggle.addEventListener("click", toggleChat);
//         chatToggle.addEventListener("keydown", (e) => {
//             if (e.key === "Enter" || e.key === " ") toggleChat();
//         });
        
//         closeChat.addEventListener("click", () => {
//             document.getElementById("ai-chat-container").style.display = "none";
//         });
        
//         minimizeChat.addEventListener("click", () => {
//             const chatContainer = document.getElementById("ai-chat-container");
//             if (chatContainer.style.height === "40px") {
//                 chatContainer.style.height = "";
//                 document.getElementById("ai-chat-box").style.display = "block";
//                 document.getElementById("ai-chat-input").style.display = "flex";
//                 document.getElementById("generate-mindmap").style.display = "block";
//                 document.getElementById("mindmap-container").style.display = 
//                     document.getElementById("mindmap-container").dataset.wasVisible === "true" ? "block" : "none";
//             } else {
//                 document.getElementById("mindmap-container").dataset.wasVisible = 
//                     document.getElementById("mindmap-container").style.display === "block" ? "true" : "false";
//                 chatContainer.style.height = "40px";
//                 document.getElementById("ai-chat-box").style.display = "none";
//                 document.getElementById("ai-chat-input").style.display = "none";
//                 document.getElementById("generate-mindmap").style.display = "none";
//                 document.getElementById("mindmap-container").style.display = "none";
//             }
//         });
        
//         sendButton.addEventListener("click", sendChatMessage);
        
//         chatInput.addEventListener("keypress", (e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 sendChatMessage();
//             }
//         });
        
//         // Auto-expanding textarea
//         chatInput.addEventListener("input", function() {
//             this.style.height = "auto";
//             const newHeight = Math.min(this.scrollHeight, 120);
//             this.style.height = newHeight + "px";
//         });
        
//         generateButton.addEventListener("click", renderMindMap);
        
//         // Listen for Escape key to close chat
//         document.addEventListener("keydown", (e) => {
//             if (e.key === "Escape") {
//                 const chatContainer = document.getElementById("ai-chat-container");
//                 if (chatContainer.style.display !== "none") {
//                     chatContainer.style.display = "none";
//                 }
//             }
//         });
//     }

//     // Toggle chat visibility
//     function toggleChat() {
//         const chatContainer = document.getElementById("ai-chat-container");
//         const isVisible = chatContainer.style.display !== "none";
        
//         chatContainer.style.display = isVisible ? "none" : "flex";
        
//         if (!isVisible) {
//             document.getElementById("chat-input").focus();
            
//             // Add welcome message if chat is empty
//             const chatBox = document.getElementById("ai-chat-box");
//             if (chatBox.childNodes.length === 0) {
//                 addMessage("Hello! I'm Samarth. How can I help you today?", "bot");
//             }
//         }
//     }

//     // Global variable to store the mind map data
//     let currentMindMapData = null;

//     // Send user message and get AI response
//     function sendChatMessage() {
//         const inputField = document.getElementById("chat-input");
//         const query = inputField.value.trim();
        
//         if (!query) return;
        
//         addMessage(query, "user");
//         inputField.value = "";
//         inputField.style.height = "auto";
        
//         // Show typing indicator
//         showTypingIndicator();
        
//         // Get AI response
//         askGemini(query)
//             .finally(() => {
//                 removeTypingIndicator();
//             });
//     }

//     // Show typing indicator
//     function showTypingIndicator() {
//         const chatBox = document.getElementById("ai-chat-box");
//         const indicator = document.createElement("div");
//         indicator.id = "typing-indicator";
//         indicator.style = `
//             padding: 8px 12px;
//             background: #f1f1f1;
//             border-radius: 12px;
//             margin: 5px 0;
//             width: fit-content;
//             display: flex;
//             align-items: center;
//         `;
        
//         // Add animated dots
//         for (let i = 0; i < 3; i++) {
//             const dot = document.createElement("div");
//             dot.style = `
//                 height: 8px;
//                 width: 8px;
//                 background: #888;
//                 border-radius: 50%;
//                 margin: 0 2px;
//                 opacity: 0.7;
//                 animation: pulse 1.5s infinite ease-in-out;
//                 animation-delay: ${i * 0.2}s;
//             `;
//             indicator.appendChild(dot);
//         }
        
//         chatBox.appendChild(indicator);
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }

//     // Remove typing indicator
//     function removeTypingIndicator() {
//         const indicator = document.getElementById("typing-indicator");
//         if (indicator) {
//             indicator.remove();
//         }
//     }

//     // Ask Gemini API
//     async function askGemini(query, retryCount = 3, delay = 1000) {
//         const apiUrl = config.apiEndpoints.chat;

//         const requestBody = {
//             query: query, 
//             mindmap: currentMindMapData 
//         };

//         try {
//             // Send request to backend
//             const response = await fetch(apiUrl, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(requestBody),
//             });

//             // Handle rate-limiting (429)
//             if (response.status === 429 && retryCount > 0) {
//                 console.warn("Rate limited! Retrying in", delay, "ms");
//                 await new Promise(resolve => setTimeout(resolve, delay));
//                 return askGemini(query, retryCount - 1, delay * 2); // Exponential backoff
//             }

//             if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

//             const data = await response.json();
            
//             // Extract and display the chatbot response
//             const botResponse = data || "I couldn't generate a response. Please try again.";
//             addMessage(botResponse, "bot");

//         } catch (error) {
//             console.error("Chat API Error:", error);
//             addMessage(`❌ Error: Unable to connect to AI service. ${error.message}`, "bot");
//         }
//     }

//     // Modified renderMindMap function to automatically create and display a Mermaid mindmap
//     async function renderMindMap() {
//         const url = window.location.href;
//         console.log("Current URL:", url);
        
//         // Show mind map container
//         const mindMapContainer = document.getElementById("mindmap-container");
//         mindMapContainer.style.display = "block";
        
//         // Get and disable button
//         const generateButton = document.getElementById("generate-mindmap");
//         generateButton.disabled = true;
//         generateButton.innerHTML = `
//             <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: rotate 1s linear infinite;">
//                 <circle cx="12" cy="12" r="10" stroke-dasharray="30 30" stroke-dashoffset="0"></circle>
//             </svg>
//             Generating (may take up to 2 minutes)
//         `;
//         generateButton.style.opacity = "0.7";
        
//         // Add spinner animation
//         if (!document.getElementById("spinner-animation")) {
//             const style = document.createElement("style");
//             style.id = "spinner-animation";
//             style.textContent = `
//                 @keyframes rotate {
//                     0% { transform: rotate(0deg); }
//                     100% { transform: rotate(360deg); }
//                 }
//             `;
//             document.head.appendChild(style);
//         }
        
//         // Make sure Mermaid is loaded
//         if (typeof mermaid === 'undefined') {
//             // Dynamically load Mermaid
//             await loadMermaid();
//         }
        
//         try {
//             const response = await sendMindMapToApi(url);
//             console.log("Mind Map API Response:", response);
            
//             if (response.mindmap) {
//                 currentMindMapData = response.mindmap;
                
//                 // Convert the text-based mind map to Mermaid syntax
//                 const mermaidMindMap = convertToMermaidMindMap(currentMindMapData);
                
//                 // Create a unique ID for the mermaid diagram
//                 const mermaidDivId = "mermaid-diagram-" + Date.now();
                
//                 // Create container with controls
//                 mindMapContainer.innerHTML = `
//                     <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
//                         <h3 style="margin: 0; font-size: 16px;">Mind Map: ${document.title}</h3>
//                         <div>
//                             <button id="download-mindmap" style="background: ${config.colors.primary}; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; margin-right: 5px;">
//                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                                     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                                     <polyline points="7 10 12 15 17 10"></polyline>
//                                     <line x1="12" y1="15" x2="12" y2="3"></line>
//                                 </svg>
//                                 Save
//                             </button>
//                             <button id="close-mindmap" style="background: #f0f0f0; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                     <div class="mermaid" id="${mermaidDivId}">${mermaidMindMap}</div>
//                 `;
                
//                 // Render the diagram
//                 mermaid.initialize({
//                     startOnLoad: true,
//                     theme: 'default',
//                     flowchart: { curve: 'basis' },
//                     securityLevel: 'loose'
//                 });
                
//                 setTimeout(() => {
//                     mermaid.render(mermaidDivId, mermaidMindMap).then(({ svg }) => {
//                         document.getElementById(mermaidDivId).innerHTML = svg;
                        
//                         // Add event listener for download button
//                         document.getElementById("download-mindmap").addEventListener("click", () => {
//                             downloadSvg(svg, "mindmap.svg");
//                         });
                        
//                         // Add event listener for close button
//                         document.getElementById("close-mindmap").addEventListener("click", () => {
//                             mindMapContainer.style.display = "none";
//                         });
//                     }).catch(err => {
//                         console.error("Mermaid rendering error:", err);
//                         mindMapContainer.innerHTML = `
//                             <p style="color: red;">❌ Error rendering mindmap: ${err.message}</p>
//                             <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;">
//                                 ${mermaidMindMap}
//                             </pre>
//                         `;
//                     });
//                 }, 100);
//             } else {
//                 currentMindMapData = null;
//                 mindMapContainer.innerHTML = `<p style="color: red;">❌ Error: Failed to generate mind map.</p>`;
//             }
//         } catch (error) {
//             console.error("Mind Map API error:", error);
//             currentMindMapData = null;
//             mindMapContainer.innerHTML = `<p style="color: red;">❌ Connection Error: ${error.message || "Failed to connect to API service."}</p>`;
//         } finally {
//             resetButton();
//         }
//     }
    
//     // Reset the generate button
//     function resetButton() {
//         const generateButton = document.getElementById("generate-mindmap");
//         generateButton.disabled = false;
//         generateButton.innerHTML = `
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <path d="M9 9l6 6"></path>
//                 <path d="M15 9l-6 6"></path>
//             </svg>
//             Generate Mind Map
//         `;
//         generateButton.style.opacity = "1";
//     }
    
//     // Load Mermaid.js dynamically
//     async function loadMermaid() {
//         return new Promise((resolve, reject) => {
//             const script = document.createElement('script');
//             script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
//             script.onload = function() {
//                 mermaid.initialize({
//                     startOnLoad: false,
//                     theme: 'default',
//                     securityLevel: 'loose'
//                 });
//                 resolve();
//             };
//             script.onerror = function() {
//                 reject(new Error("Failed to load Mermaid.js library"));
//             };
//             document.head.appendChild(script);
//         });
//     }
    
//     // Download SVG function
//     function downloadSvg(svgContent, filename) {
//         const blob = new Blob([svgContent], {type: "image/svg+xml"});
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//     }

//     // Function to convert text-based mind map to Mermaid mindmap syntax
//     function convertToMermaidMindMap(textMindMap) {
//         // Split the mindmap into lines
//         const lines = textMindMap.split('\n');
        
//         // Start with the mindmap header
//         let mermaidSyntax = 'mindmap\n';
        
//         // Process lines to determine hierarchy
//         const nodes = [];
//         const parentMap = {};
        
//         // Parse the indentation to build a tree structure
//         let prevIndentLevel = -1;
//         let prevNodeId = null;
//         let parentStack = [];
        
//         for (let i = 0; i < lines.length; i++) {
//             const line = lines[i];
//             if (!line.trim()) continue; // Skip empty lines
            
//             // Calculate indentation level (number of spaces at beginning)
//             const indentMatch = line.match(/^(\s*)/);
//             const indentLevel = indentMatch ? indentMatch[1].length / 2 : 0;
            
//             // Clean the node text
//             const nodeText = line.trim().replace(/^[-*•]+\s*/, '');
//             if (!nodeText) continue;
            
//             // Create a unique ID for this node
//             const nodeId = `node_${i}`;
            
//             // Determine parent based on indentation
//             if (indentLevel > prevIndentLevel) {
//                 // This is a child of the previous node
//                 if (prevNodeId) {
//                     parentStack.push(prevNodeId);
//                     parentMap[nodeId] = prevNodeId;
//                 }
//             } else if (indentLevel < prevIndentLevel) {
//                 // Go back up the tree
//                 const levelsToGoUp = prevIndentLevel - indentLevel;
//                 for (let j = 0; j < levelsToGoUp && parentStack.length > 0; j++) {
//                     parentStack.pop();
//                 }
//                 parentMap[nodeId] = parentStack.length > 0 ? parentStack[parentStack.length - 1] : null;
//             } else {
//                 // Same level as previous node (sibling)
//                 parentMap[nodeId] = parentStack.length > 0 ? parentStack[parentStack.length - 1] : null;
//             }
            
//             // Store the node
//             nodes.push({
//                 id: nodeId,
//                 text: nodeText,
//                 level: indentLevel
//             });
            
//             prevIndentLevel = indentLevel;
//             prevNodeId = nodeId;
//         }
        
//         // Build the Mermaid syntax
//         if (nodes.length > 0) {
//             // Root node
//             const rootNode = nodes[0];
//             mermaidSyntax += `  root((${escapeSpecialChars(rootNode.text)}))\n`;
            
//             // Add all other nodes with their relationships
//             for (let i = 1; i < nodes.length; i++) {
//                 const node = nodes[i];
//                 const parent = parentMap[node.id] || 'root';
                
//                 // Choose shape based on level
//                 let shape;
//                 const level = node.level % 4;
//                 switch(level) {
//                     case 1: shape = '('; break;     // Round
//                     case 2: shape = '['; break;     // Square
//                     case 3: shape = '{{'; break;    // Hexagon
//                     default: shape = '('; break;    // Default to round
//                 }
                
//                 const endShape = shape === '{{' ? '}}' : shape === '(' ? ')' : ']';
                
//                 // Use --> for parent-child relationship
//                 mermaidSyntax += `  ${parent} --> ${node.id}${shape}${escapeSpecialChars(node.text)}${endShape}\n`;
//             }
//         }
        
//         return mermaidSyntax;
//     }

//     // Escape special characters that might break Mermaid syntax
//     function escapeSpecialChars(text) {
//         return text
//             .replace(/"/g, '\\"')
//             .replace(/\(/g, '\\(')
//             .replace(/\)/g, '\\)')
//             .replace(/:/g, '\\:');
//     }

//     // Send URL to backend API
//     async function sendMindMapToApi(url) {
//         try {
//             const response = await fetch(config.apiEndpoints.mindMap, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ url: url }),
//             });

//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status} ${response.statusText}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error("Mind Map API error:", error);
//             throw error;
//         }
//     }

//     // Initialize the chat interface
//     function initialize() {
//         initializeChatUI();
//         setupEventListeners();
//         console.log("✅ AI Chat interface initialized successfully");
//     }

//     // Start initialization
//     initialize();
// })();


// the code
//three
(function() {
    // Prevent multiple initializations
    if (document.getElementById("ai-chat-toggle")) return;

    // Configuration
    const config = {
        colors: {
            primary: "#0078ff",
            secondary: "#28a745",
            background: "#ffffff",
            lightGray: "#f1f1f1"
        },
        apiEndpoints: {
            chat: "https://localhost:8000/gemini",
            mindMap: "https://localhost:8000/extract"
        },
        mermaidConfig: {
            startOnLoad: false,
            theme: 'default',
            flowchart: { curve: 'basis' },
            securityLevel: 'loose'
        }
    };

    // Create and append chat UI
    function initializeChatUI() {
        // Inject Chat Toggle Button
        // Inject Chat Toggle Button
        const button = document.createElement("div");
        button.id = "ai-chat-toggle";
        button.setAttribute("aria-label", "Open AI Chat");
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");
        button.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>`;
        // Don't set inline styles - let the CSS handle it
        document.body.appendChild(button);

        // Chat Container
        const chatContainer = document.createElement("div");
        chatContainer.id = "ai-chat-container";
        chatContainer.style = `
            position: fixed; bottom: 80px; right: 30px;
            width: 380px; max-height: 600px;
            background: ${config.colors.background}; border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: none; flex-direction: column;
            z-index: 10000; overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            transition: all 0.3s ease;
        `;
        
        chatContainer.innerHTML = `
            <div id="ai-chat-header" style="background: ${config.colors.primary}; color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                <span>Samarth</span>
                <div>
                    <button id="minimize-chat" aria-label="Minimize chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 4px 8px; margin-right: 4px;">_</button>
                    <button id="close-chat" aria-label="Close chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 4px 8px;">✖</button>
                </div>
            </div>
            <div id="ai-chat-box" style="flex-grow: 1; height: 320px; overflow-y: auto; padding: 16px; background: #f9f9f9; scroll-behavior: smooth;"></div>
            <div id="ai-chat-input" style="display: flex; padding: 12px; border-top: 1px solid #eee; background: white;">
                <textarea id="chat-input" placeholder="Ask something..." aria-label="Type your message" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; outline: none; resize: none; min-height: 40px; max-height: 120px;"></textarea>
                <button id="send-chat" aria-label="Send message" style="margin-left: 8px; background: ${config.colors.primary}; color: white; border: none; border-radius: 6px; padding: 0 16px; cursor: pointer; transition: background 0.2s;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4L22 2z"></path>
                    </svg>
                </button>
            </div>
            <button id="generate-mindmap" aria-label="Generate mind map" style="width: 100%; padding: 12px; border: none; background: ${config.colors.secondary}; color: white; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                </svg>
                Generate Mind Map
            </button>
            <div id="mindmap-container" style="max-height: 300px; overflow-y: auto; padding: 16px; background: #f9f9f9; border-top: 1px solid #eee; display: none;"></div>
        `;
        
        document.body.appendChild(chatContainer);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #chat-input {
                overflow-y: hidden;
                transition: height 0.1s ease;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.2); opacity: 1; }
            }
            .message {
                animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .mermaid svg {
                max-width: 100%;
                height: auto;
            }
        `;
        document.head.appendChild(style);
        
        // Add internal Mermaid.js implementation
        injectMermaidLibrary();
    }

    // Inject Mermaid library directly to avoid CSP issues
    function injectMermaidLibrary() {
        // Create a script element for Mermaid
        const script = document.createElement('script');
        script.id = 'mermaid-script';
        script.type = 'text/javascript';
        
        // Here we bundle the Mermaid library directly instead of loading from CDN
        // This is a minified version of Mermaid that should work with CSP
        script.textContent = `
            // Mermaid library code would be inlined here
            // This is a placeholder for the actual minified code
            window.mermaid = {
                initialize: function(config) {
                    window.mermaidConfig = config;
                },
                render: async function(id, definition) {
                    // Simple SVG rendering for mindmaps
                    try {
                        const lines = definition.split('\\n');
                        const title = lines.find(line => line.includes('root'))?.match(/\\(\\((.*?)\\)\\)/)?.[1] || 'Mind Map';
                        
                        // Create a basic SVG for the mindmap
                        const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
                            '<style>.node {fill: #fff; stroke: #333; stroke-width: 2px;} ' +
                            '.node-text {font-family: Arial; font-size: 14px;} ' + 
                            '.edge {stroke: #888; stroke-width: 2px;}</style>' +
                            '<rect width="100%" height="100%" fill="#f9f9f9" />' +
                            '<g transform="translate(400,50)">' +
                            '<circle cx="0" cy="0" r="40" class="node" />' +
                            '<text x="0" y="5" text-anchor="middle" class="node-text">' + title + '</text>' +
                            // Add basic representations of nodes
                            '<g>' + generateNodesFromDefinition(definition) + '</g>' +
                            '</g>' +
                            '</svg>';
                        
                        return { svg: svg };
                    } catch (error) {
                        console.error("Mermaid rendering error:", error);
                        return { 
                            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 60">' +
                                '<rect width="100%" height="100%" fill="#fee" />' +
                                '<text x="10" y="30" fill="red">Error rendering mindmap</text>' +
                                '</svg>' 
                        };
                    }
                }
            };
            
            // Helper function to generate SVG nodes from definition
            function generateNodesFromDefinition(definition) {
                let nodes = '';
                let y = 80;
                
                // Extract relevant node lines and create simple visualization
                definition.split('\\n').forEach((line, index) => {
                    if (line.includes('-->') && !line.includes('root')) {
                        const nodeText = line.match(/\\([^)]*\\)/)?.[0] || 
                                       line.match(/\\{\\{[^}]*\\}\\}/)?.[0] || 
                                       line.match(/\\[[^\\]]*\\]/)?.[0] || '';
                        
                        if (nodeText) {
                            // Clean node text
                            const cleanText = nodeText.replace(/[\\(\\)\\[\\]\\{\\}]/g, '');
                            
                            // Position nodes in a simple tree layout
                            const x = -150 + (index % 2) * 300;
                            
                            nodes += '<circle cx="' + x + '" cy="' + y + '" r="30" class="node" />' +
                                    '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" class="node-text">' + 
                                    (cleanText.length > 15 ? cleanText.substring(0, 15) + '...' : cleanText) + '</text>' +
                                    '<line x1="0" y1="40" x2="' + x + '" y2="' + (y - 30) + '" class="edge" />';
                            
                            // Increment y position for next node
                            if (index % 2 === 1) y += 80;
                        }
                    }
                });
                
                return nodes;
            }
        `;
        
        document.head.appendChild(script);
    }

    // Add message to chat
    function addMessage(text, sender) {
        const chatBox = document.getElementById("ai-chat-box");
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        
        // Style based on sender
        const isUser = sender === "user";
        messageDiv.style = `
            padding: 10px 14px;
            border-radius: 14px;
            margin: 8px 0;
            max-width: 85%;
            line-height: 1.4;
            word-wrap: break-word;
            ${isUser 
                ? `background: ${config.colors.primary}; color: white; margin-left: auto; border-bottom-right-radius: 4px;` 
                : `background: white; color: #333; margin-right: auto; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);`}
        `;
        
        // Format message text (simple markdown-like parsing)
        text = formatMessageText(text);
        
        messageDiv.innerHTML = text;
        chatBox.appendChild(messageDiv);
        
        // Auto scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Format message text with markdown support
    function formatMessageText(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold: **text**
            .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic: *text*
            .replace(/`(.*?)`/g, "<code style='background:#f0f0f0;padding:2px 4px;border-radius:3px;font-family:monospace;'>$1</code>") // Inline code: `text`
            .replace(/```(.*?)```/gs, "<pre style='background:#f0f0f0;padding:8px;border-radius:4px;overflow-x:auto;font-family:monospace;'>$1</pre>") // Code block: ```text```
            .replace(/\n/g, "<br>"); // Line breaks
    }

    // Set up event listeners
    function setupEventListeners() {
        const chatToggle = document.getElementById("ai-chat-toggle");
        const closeChat = document.getElementById("close-chat");
        const minimizeChat = document.getElementById("minimize-chat");
        const sendButton = document.getElementById("send-chat");
        const chatInput = document.getElementById("chat-input");
        const generateButton = document.getElementById("generate-mindmap");

        chatToggle.addEventListener("click", toggleChat);
        chatToggle.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") toggleChat();
        });
        
        closeChat.addEventListener("click", () => {
            document.getElementById("ai-chat-container").style.display = "none";
        });
        
        minimizeChat.addEventListener("click", () => {
            const chatContainer = document.getElementById("ai-chat-container");
            if (chatContainer.style.height === "40px") {
                chatContainer.style.height = "";
                document.getElementById("ai-chat-box").style.display = "block";
                document.getElementById("ai-chat-input").style.display = "flex";
                document.getElementById("generate-mindmap").style.display = "block";
                document.getElementById("mindmap-container").style.display = 
                    document.getElementById("mindmap-container").dataset.wasVisible === "true" ? "block" : "none";
            } else {
                document.getElementById("mindmap-container").dataset.wasVisible = 
                    document.getElementById("mindmap-container").style.display === "block" ? "true" : "false";
                chatContainer.style.height = "40px";
                document.getElementById("ai-chat-box").style.display = "none";
                document.getElementById("ai-chat-input").style.display = "none";
                document.getElementById("generate-mindmap").style.display = "none";
                document.getElementById("mindmap-container").style.display = "none";
            }
        });
        
        sendButton.addEventListener("click", sendChatMessage);
        
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
        
        // Auto-expanding textarea
        chatInput.addEventListener("input", function() {
            this.style.height = "auto";
            const newHeight = Math.min(this.scrollHeight, 120);
            this.style.height = newHeight + "px";
        });
        
        generateButton.addEventListener("click", renderMindMap);
        
        // Listen for Escape key to close chat
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                const chatContainer = document.getElementById("ai-chat-container");
                if (chatContainer.style.display !== "none") {
                    chatContainer.style.display = "none";
                }
            }
        });
    }

    // Toggle chat visibility
    function toggleChat() {
        const chatContainer = document.getElementById("ai-chat-container");
        const isVisible = chatContainer.style.display !== "none";
        
        chatContainer.style.display = isVisible ? "none" : "flex";
        
        if (!isVisible) {
            document.getElementById("chat-input").focus();
            
            // Add welcome message if chat is empty
            const chatBox = document.getElementById("ai-chat-box");
            if (chatBox.childNodes.length === 0) {
                addMessage("Hello! I'm Samarth. How can I help you today?", "bot");
            }
        }
    }

    // Global variable to store the mind map data
    let currentMindMapData = null;

    // Send user message and get AI response
    function sendChatMessage() {
        const inputField = document.getElementById("chat-input");
        const query = inputField.value.trim();
        
        if (!query) return;
        
        addMessage(query, "user");
        inputField.value = "";
        inputField.style.height = "auto";
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get AI response
        askGemini(query)
            .finally(() => {
                removeTypingIndicator();
            });
    }

    // Show typing indicator
    function showTypingIndicator() {
        const chatBox = document.getElementById("ai-chat-box");
        const indicator = document.createElement("div");
        indicator.id = "typing-indicator";
        indicator.style = `
            padding: 8px 12px;
            background: #f1f1f1;
            border-radius: 12px;
            margin: 5px 0;
            width: fit-content;
            display: flex;
            align-items: center;
        `;
        
        // Add animated dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement("div");
            dot.style = `
                height: 8px;
                width: 8px;
                background: #888;
                border-radius: 50%;
                margin: 0 2px;
                opacity: 0.7;
                animation: pulse 1.5s infinite ease-in-out;
                animation-delay: ${i * 0.2}s;
            `;
            indicator.appendChild(dot);
        }
        
        chatBox.appendChild(indicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById("typing-indicator");
        if (indicator) {
            indicator.remove();
        }
    }

    // Ask Gemini API
    async function askGemini(query, retryCount = 3, delay = 1000) {
        const apiUrl = config.apiEndpoints.chat;

        const requestBody = {
            query: query, 
            mindmap: currentMindMapData 
        };

        try {
            // Send request to backend
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            // Handle rate-limiting (429)
            if (response.status === 429 && retryCount > 0) {
                console.warn("Rate limited! Retrying in", delay, "ms");
                await new Promise(resolve => setTimeout(resolve, delay));
                return askGemini(query, retryCount - 1, delay * 2); // Exponential backoff
            }

            if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

            const data = await response.json();
            
            // Extract and display the chatbot response
            const botResponse = data || "I couldn't generate a response. Please try again.";
            addMessage(botResponse, "bot");

        } catch (error) {
            console.error("Chat API Error:", error);
            addMessage(`❌ Error: Unable to connect to AI service. ${error.message}`, "bot");
        }
    }

    async function renderMindMap() {
        const url = window.location.href;
        console.log("Current URL:", url);
    
        const mindMapContainer = document.getElementById("mindmap-container");
        mindMapContainer.style.display = "block";
    
        const generateButton = document.getElementById("generate-mindmap");
        generateButton.disabled = true;
        generateButton.innerHTML = `
            <span style="font-size: 16px; margin-right: 6px;">⏳</span>
            Generating Mind Map...
        `;
        generateButton.style.opacity = "0.7";
    
        try {
            const response = await sendMindMapToApi(url);
            console.log("Mind Map API Response:", response);
    
            if (response.mindmap) {
                currentMindMapData = response.mindmap; // Mermaid-formatted
    
                // Remove Markdown backticks from the Mermaid code
                const mermaidCode = currentMindMapData.replace(/```mermaid\s*/i, "").replace(/```$/, "").trim();
    
                // Insert Mermaid code into the frontend with both view and close buttons
                mindMapContainer.innerHTML = `
                    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 16px;">Mind Map: ${document.title}</h3>
                        <div>
                            <button id="view-mindmap" style="background: #0088cc; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; margin-right: 5px;">
                                View
                            </button>
                            <button id="close-mindmap" style="background: #f0f0f0; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">
                                Close
                            </button>
                        </div>
                    </div>
                    <div class="mermaid" style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;">
                        ${mermaidCode}
                    </div>
                `;
    
                // Render the Mermaid diagram; use a timeout to ensure the element is in the DOM
                setTimeout(() => {
                    if (window.mermaid) {
                        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
                    } else {
                        console.error("Mermaid.js failed to load.");
                    }
                }, 100);
    
                // View button functionality: opens the mind map in a new tab
                document.getElementById("view-mindmap").addEventListener("click", () => {
                    const newWindow = window.open('', '_blank');
                    newWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Mind Map - ${document.title}</title>
                            <script type="module">
                                import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
                                mermaid.initialize({ startOnLoad: true });
                            </script>
                            <style>
                                body { font-family: Arial, sans-serif; margin: 20px; }
                                .mermaid { background: #f5f5f5; padding: 10px; border-radius: 5px; }
                            </style>
                        </head>
                        <body>
                            <h3>Mind Map: ${document.title}</h3>
                            <div class="mermaid">
                                ${mermaidCode}
                            </div>
                        </body>
                        </html>
                    `);
                    newWindow.document.close();
                });
    
                // Close button functionality
                document.getElementById("close-mindmap").addEventListener("click", () => {
                    mindMapContainer.style.display = "none";
                });
    
            } else {
                mindMapContainer.innerHTML = `<p style="color: red;">❌ Error: Failed to generate mind map.</p>`;
            }
        } catch (error) {
            console.error("Mind Map API error:", error);
            mindMapContainer.innerHTML = `<p style="color: red;">❌ Connection Error: ${error.message || "Failed to connect to API service."}</p>`;
        } finally {
            // Reset the generate button to its original state
            generateButton.disabled = false;
            generateButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                </svg>
                Generate Mind Map
            `;
            generateButton.style.opacity = "1";
        }
    }

    // Send URL to API for mind map generation
    async function sendMindMapToApi(url) {
        try {
            const response = await fetch(config.apiEndpoints.mindMap, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Mind Map API Error:", error);
            throw error;
        }
    }

    // Initialize the chat UI
    initializeChatUI();
    setupEventListeners();
})();