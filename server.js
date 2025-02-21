const express = require('express');
const ollama = require('ollama');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const axios = require('axios');

const app = express();
const router = express.Router();


//add other middleware
// HTTP request logger middleware for node.js
app.use(cors());
app.use(bodyParser.json({ limit: '200mb' })); // "limit" is to avoid request errors: PayloadTooLargeError: request entity too large



router.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    try {

        

        // Use AnythingLLM's API  (http://localhost:3001/api/docs/)
        const ALLM_API_KEY = '7WVB711-8AHMYVN-GTJNVMZ-QYCC57T';
        const WORKSPACE_NAME = 'test';
        const response = await axios.post(`http://localhost:3001/api/v1/workspace/${WORKSPACE_NAME}/chat`, {
            model: 'deepseek-r1:14b-qwen-distill-q4_K_M',
            message: prompt,
            mode: 'chat'   // query | chat
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ALLM_API_KEY}`
            }
        });

        res.json({ reply: response.data.textResponse });



        // Use ollama's API
        /*
        const response = await axios.post(`http://localhost:11434/api/generate`, {
            model: 'deepseek-r1:14b-qwen-distill-q4_K_M',
            prompt: prompt,
            stream: false
        });

        res.json({ reply: response.data.response });
        */

        /*
        const response = await ollama.chat({
            model: 'deepseek-r1:14b-qwen-distill-q4_K_M',  // llama3.1:8b
            messages: [{ role: 'user', content: prompt }],
        });

        res.json({ reply: response.message.content });
        */
       

    } catch (error) {
        res.status(500).send({ error: 'Error interacting with the model' });
    }
});

app.use('/api', router);
app.use('/home', express.static(path.join(__dirname, '.', `/public`)))


const PORT = process.env.PORT || port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});