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
            // gemini: "https://localhost:8000/gemini",
            mindMap: "https://localhost:8000/extract"
        }
    };

    // Create and append chat UI
    function initializeChatUI() {
        // Inject Chat Toggle Button
        const button = document.createElement("div");
        button.id = "ai-chat-toggle";
        button.setAttribute("aria-label", "Open AI Chat");
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");
        button.innerText = "💬";
        button.style = `
            position: fixed; bottom: 20px; right: 20px;
            background: ${config.colors.primary}; color: white;
            padding: 15px; border-radius: 80px;
            cursor: pointer; font-size: 24px;
            z-index: 9999; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: flex; align-items: center; justify-content: center;
            width: 50px; height: 50px; transition: all 0.3s ease;
        `;
        document.body.appendChild(button);

        // Chat Container
        const chatContainer = document.createElement("div");
        chatContainer.id = "ai-chat-container";
        chatContainer.style = `
            position: fixed; bottom: 80px; right: 30px;
            width: 500px; max-height: 700px;
            background: ${config.colors.background}; border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: none; flex-direction: column;
            z-index: 10000; overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;
        
        chatContainer.innerHTML = `
            <div id="ai-chat-header" style="background: ${config.colors.primary}; color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                <span>Samarth</span>
                <button id="close-chat" aria-label="Close chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 4px 8px;">✖</button>
            </div>
            <div id="ai-chat-box" style="flex-grow: 1; height: 300px; overflow-y: auto; padding: 16px; background: #f9f9f9; scroll-behavior: smooth;"></div>
            <div id="ai-chat-input" style="display: flex; padding: 12px; border-top: 1px solid #eee; background: white;">
                <input type="text" id="chat-input" placeholder="Ask something..." aria-label="Type your message" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; outline: none;">
                <button id="send-chat" aria-label="Send message" style="margin-left: 8px; background: ${config.colors.primary}; color: white; border: none; border-radius: 6px; padding: 0 16px; cursor: pointer; transition: background 0.2s;">➤</button>
            </div>
            <button id="generate-mindmap" aria-label="Generate mind map" style="width: 100%; padding: 12px; border: none; background: ${config.colors.secondary}; color: white; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s;">🧠 Generate Mind Map</button>
            <div id="mindmap-container" style="max-height: 200px; overflow-y: auto; padding: 16px; background: #f9f9f9; border-top: 1px solid #eee; display: none;"></div>
        `;
        
        document.body.appendChild(chatContainer);
    }

    // Add this to your content.js file if it's missing
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
        max-width: 80%;
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

    // Add event listeners
    function setupEventListeners() {
        const chatToggle = document.getElementById("ai-chat-toggle");
        const closeChat = document.getElementById("close-chat");
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
        
        sendButton.addEventListener("click", sendChatMessage);
        
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendChatMessage();
        });
        
        generateButton.addEventListener("click", renderMindMap);
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
                addMessage("Hello! How can I help you today?", "bot");
            }
        }
    }

    // Send user message and get AI response
    function sendChatMessage() {
        const inputField = document.getElementById("chat-input");
        const query = inputField.value.trim();
        
        if (!query) return;
        
        addMessage(query, "user");
        inputField.value = "";
        
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
        
        // Add animation style
        if (!document.getElementById("typing-animation")) {
            const style = document.createElement("style");
            style.id = "typing-animation";
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
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

   
    // Global variable to store the mind map data
let currentMindMapData = null;

// Modified renderMindMap function to store the mind map data
async function renderMindMap() {
    const url = window.location.href;
    console.log("Current URL:", url);

    // Show mind map container
    const mindMapContainer = document.getElementById("mindmap-container");
    mindMapContainer.style.display = "block";
    
    // Get and disable button
    const generateButton = document.getElementById("generate-mindmap");
    generateButton.disabled = true;
    generateButton.innerText = "⏳ May take upto 2 minutes";
    generateButton.style.opacity = "0.7";
    
    try {
        const response = await sendMindMapToApi(url);
        console.log("Mind Map API Response:", response);
    
        if (response.mindmap) {  // Check if mindmap exists
            currentMindMapData = response.mindmap;
    
            // Format the mindmap for display
            const formattedMindMap = response.mindmap
                .split("\n")  // Convert to an array of lines
                .map(line => `<li>${line}</li>`)  // Wrap each line in a list item
                .join("");  // Convert back to a string
    
            // Display the mind map properly inside a <ul>
            mindMapContainer.innerHTML = `
                <ul style="padding-left: 16px;">${formattedMindMap}</ul>
            `;
        } else {
            currentMindMapData = null;
            mindMapContainer.innerHTML = `<p style="color: red;">❌ Error: Failed to generate mind map.</p>`;
        }
    } catch (error) {
        console.error("Mind Map API error:", error);
        currentMindMapData = null;
        mindMapContainer.innerHTML = `<p style="color: red;">❌ Connection Error: ${error.message || "Failed to connect to API service."}</p>`;
    } finally {
        generateButton.disabled = false;
        generateButton.innerText = "🧠 Generate Mind Map";
        generateButton.style.opacity = "1";
    }
    
    
}

async function askGemini(query, retryCount = 3, delay = 1000) {
    const apiUrl = "https://localhost:8000/gemini"; // API route

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
        console.log(data);
        
        // Extract and display the chatbot response
        const botResponse = data || "I couldn't generate a response. Please try again.";
        addMessage(botResponse, "bot");

    } catch (error) {
        console.error("Gemini API Error:", error);
        addMessage("❌ Error: Unable to connect to AI. Please try again later.", "bot");
    }
}



// Function to format message text (supports basic markdown-like syntax)
function formatMessageText(text) {
    return text
        .replace(/\*(.*?)\*/g, "<strong>$1</strong>") // Bold: *text*
        .replace(/_(.*?)_/g, "<em>$1</em>") // Italic: _text_
        .replace(/`(.*?)`/g, "<code>$1</code>"); // Inline code: `text`
}

    // Truncate URL for display
    function truncateUrl(url, maxLength) {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    }

    // Send URL to backend API ...any url
    async function sendMindMapToApi(url) {
        try {
            const response = await fetch(config.apiEndpoints.mindMap, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Mind Map API error:", error);
            throw error;
        }
    }

    // Initialize the chat interface
    function initialize() {
        initializeChatUI();
        setupEventListeners();
        console.log("✅ AI Chat interface initialized successfully");
    }

    // Start initialization
    initialize();
})();
