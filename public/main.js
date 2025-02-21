
const messages = []; // Array to hold messages

let loadingTimer; // Timer for loading state
let loadingTime = 0; // Elapsed time in seconds

function clearElapsedTime() {
    if (document.querySelector('.msg-dotted-loader-container > i') === null) return;

    // Stop loading timer
    clearInterval(loadingTimer);
    document.querySelector('.msg-dotted-loader-container > i').innerHTML = ' (0s)';
    loadingTime = 0;

}

function startElapsedTime() {
    if (document.querySelector('.msg-dotted-loader-container > i') === null) return;

    loadingTimer = setInterval(() => {
        loadingTime++;
        document.querySelector('.msg-dotted-loader-container > i').innerHTML = ` (${loadingTime}s)`;
    }, 1000);
}


function startLoading() {
    // push loading for message item
    messages.push({ sender: 'AI', type: 'reply', timestamp:  new Date().toLocaleTimeString(), content: '<div class="msg-dotted-loader-container "><span class="msg-dotted-loader"></span><span class="msg-dotted-loader-text">Thinking...</span><i> (0s)</i></div>' }); // Add AI reply to array

    // start elapsedTime
    setTimeout(() => {
        startElapsedTime();
    }, 500);
}

function stopLoading() {
    // remove loading for message item
    messages.pop();

    // clear elapsedTime
    clearElapsedTime();
}

async function fetchPost(msg) {

    // Default
    //======================
    let  _data = null;
    const res = await axios.post(`http://localhost:3000/api/generate`, {
        prompt: msg
    }).catch(function (error) {
        console.log(error);
    });

    if (res && res.status == 200) _data = res.data;

    return _data;


    // if stream is true, for browser (ollama's API)
    //======================
    /*
    const response = await fetch(`http://localhost:11434/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: modelName.current,
            prompt: msg,
            stream: true
        }),
    });

    return response;
    */

}

const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const loadingDiv = document.getElementById('loading');

const sendMessage = async () => {
    const message = messageInput.value;

    if (message.trim() === '') {
        return;
    }

    // User message
    const inputMsg = `${message}`;
    const timeStart = new Date().toLocaleTimeString(); // Get the current time
    messages.push({ sender: 'Me', type: 'send', timestamp: timeStart, content: inputMsg }); // Add user message to array

    // start loading
    startLoading();


    // Render messages
    renderMessages(); 

    // clear
    messageInput.value = '';

    try {
        const res = await fetchPost(message);
        const timeEnd = new Date().toLocaleTimeString(); // Get the current time

        console.log(res);


        // stop loading
        stopLoading();


        // reply (normal)
        //======================
        const reply = res.reply;
        const replyRes = `${reply}`;
        const outMsg = marked.parse(replyRes);
        messages.push({ sender: 'AI', type: 'reply', timestamp: timeEnd, content: outMsg }); // Add AI reply to array

         // Render messages
        renderMessages();


        // stream
        //======================
        /*
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let partialText = '';
        let jsonData = '';

        const streamHandler = async () => {
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                
                const text = decoder.decode(value, { stream: true });
                jsonData += text;
                
                try {
                    while (jsonData) {
                        const endOfJSON = jsonData.indexOf('}');
                        if (endOfJSON !== -1) {
                            const validJson = jsonData.slice(0, endOfJSON + 1);
                            jsonData = jsonData.slice(endOfJSON + 1);

                            const parsedData = JSON.parse(validJson);

                            // update to div
                            partialText += parsedData.response;
                        } else {
                            break;
                        }
                    }
                } catch (e) {
                    console.error('JSON parsing error: ', e);
                }

            }
        };

        streamHandler();
        */

        
    } catch (error) {

        // stop loading
        stopLoading();

        console.error('Error sending message:', error);
        messages.push({ sender: 'Error', type: 'reply', timestamp: timeStart, content: `Error: Unable to send message: ${error}` }); // Add error message to array

         // Render messages
        renderMessages();
    }

};
const debouncedSendMessage = debounce(sendMessage, 300);

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function typewriterEffect(messagesDiv, element, str, speed = 50) {
    if (!element) return;

    const originalHTML = str;
    element.innerHTML = '';

    let cursor = 0;
    let tempHTML = '';
    const tagStack = [];

    function type() {
        if (cursor >= originalHTML.length) {
            // Clear the cursor after typing is complete
            element.innerHTML = tempHTML; // Set the final content without the cursor
            return;
        }

        const currentChar = originalHTML[cursor];

        if (currentChar === '<') {
            const closeTagIndex = originalHTML.indexOf('>', cursor);
            const tagContent = originalHTML.slice(cursor, closeTagIndex + 1);
            tempHTML += tagContent;

            // Handle opening and closing tags
            if (/^<\/?\w+/.test(tagContent)) {
                if (!/^<\//.test(tagContent)) {
                    // Opening tag
                    tagStack.push(tagContent);
                } else {
                    // Closing tag
                    tagStack.pop();
                }
            }

            cursor = closeTagIndex + 1;
        } else {
            tempHTML += currentChar;
            cursor++;
        }

        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
        element.innerHTML = tempHTML + '<span class="cursor">|</span>'; // Show cursor
        setTimeout(type, speed);
    }

    type();
}


function renderMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear existing messages
    messages.forEach((msg, index) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(msg.type);
        messageDiv.innerHTML = `<strong>${msg.sender}:</strong> <div class="content">${msg.content}</div> <span class="timestamp">${msg.timestamp}</span>`;
        messagesDiv.appendChild(messageDiv);

        if (msg.type === 'reply' && index === messages.length - 1) {
            typewriterEffect(messagesDiv, [].slice.call(messagesDiv.querySelectorAll('.reply')).at(-1).querySelector('.content'), msg.content, 10);
        }
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}
sendButton.addEventListener('click', debouncedSendMessage);

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        debouncedSendMessage();
    }
});