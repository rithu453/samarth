document.getElementById("send-btn").addEventListener("click", () => {
    let userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    addMessage(userInput, "user"); // Show user message
    document.getElementById("user-input").value = "";

    // Extract webpage text and send to Gemini API
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                function: extractTextFromPage
            },
            (results) => {
                if (results && results[0] && results[0].result) {
                    let pageText = results[0].result;
                    askGemini(userInput, pageText);
                }
            }
        );
    });
});

// Function to extract webpage text
function extractTextFromPage() {
    return document.body.innerText;
}

// Function to interact with Gemini API
function askGemini(userMessage, webpageText) {
    let apiKey = "YOUR_GEMINI_API_KEY"; // Replace with actual API key
    let apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${apiKey}`;

    let requestBody = {
        prompt: {
            text: `User: ${userMessage}\n\nWebpage Context: ${webpageText}\n\nAI:`
        }
    };

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.candidates && data.candidates.length > 0) {
            addMessage(data.candidates[0].output, "bot");
        } else {
            addMessage("I couldn't understand. Please try again!", "bot");
        }
    })
    .catch(error => {
        addMessage("Error connecting to AI service.", "bot");
        console.error("Error:", error);
    });
}

// Function to add messages to chatbox
function addMessage(text, sender) {
    let chatBox = document.getElementById("chat-box");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
}
