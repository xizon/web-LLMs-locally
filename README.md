# Web LLMs Locally

Running and Creating Your Own LLMs Locally.


## *Step1:* Preparation:

Make sure a has `Ollama` and `AnythingLLM` installed. 

Make sure you have downloaded `llama3.1:8b` or `deepseek-r1:14b-qwen-distill-q4_K_M`, if not, run:

```sh
$ ollama run llama3.1:8b
```

**Configure AnythingLLM:**

 - 1. **"AI Providers" -> "LLM"** (Set up Ollama's local model)
 - 2. **"AI Providers" -> "Embedder"** (Select the local embedding engine in the "Embedding" model [set the local model of Ollama to be the same as the LLM preference, note that some embedded models are not accurately understood, please test it yourself])
 - 3. Next to the Workspace tab on the left, click on the upload icon to make a local knowledge base and move it to the workspace (it may take a long time depending on machine performance)




## *Step2:* (Optional) Customize the Model 

##### Access the model file to understand its structure and parameters. Use ollama help show to show all the commands.


```sh
$ cd ./web-llms-locally
$ ollama show llama3.1:8b --modelfile > myllama.modelfile
```


##### To create the model out of this model file you have to run the following command in your terminal:

```sh
$ ollama create myllama --file myllama.modelfile
```

##### After creating the model, you can interact with it locally using:

```sh
$ ollama run myllama
```


## *Step3:* Use third-party API


The following requests can use the model with "Ollama":

```js
async function fetchPost(msg) {
    let  _data = null;
    const res = await axios.post(`http://localhost:11434/api/generate`, {
        model: 'myllama',
        prompt: msg,
        stream: false
    }).catch(function (error) {
        console.log(error);
    });


    if (res && res.status == 200) _data = res.data;

    return _data;
}

fetchPost('Hello').then((res) => {
    console.log(res); // res.response
});
```


The following requests can use the model with "AnythingLLM":

> **Can be used for training data**

check out AnythingLLM API [http://localhost:3001/api/docs/](http://localhost:3001/api/docs/)

```js
async function fetchPost(msg) {
    let  _data = null;
    const ALLM_API_KEY = 'xxxxx-xxxxxx-xxxxxxx-xxxxxxx';
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
    }).catch(function (error) {
        console.log(error);
    });


    if (res && res.status == 200) _data = res.data;

    return _data;
}

fetchPost('Hello').then((res) => {
    console.log(res);   // res.textResponse
});
```

## *Step4:* Run the Model Listing Command:

```sh
$ ollama list
```

## *Step5:* Test:

run
```sh
$ npm start
```

With is command file will be compiled and it will be loaded on local server [http://localhost:3000/home](http://localhost:3000/home)



## Licensing

Licensed under the [MIT](https://opensource.org/licenses/MIT).

