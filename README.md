# Web LLMs Locally

Running and Creating Your Own LLMs Locally.


### Preparation:

Make sure you have downloaded `llama3.2:1b`, if not, run:

```sh
$ ollama run llama3.2:1b
```

### Customize the Model

Access the model file to understand its structure and parameters. Use ollama help show to show all the commands.


```sh
$ cd ./web-llms-locally
$ ollama show llama3.2:1b --modelfile > myllama.modelfile
```


### To create the model out of this model file you have to run the following command in your terminal:

```sh
$ ollama create myllama --file myllama.modelfile
```

### After creating the model, you can interact with it locally using:

```sh
$ ollama run myllama
```

The following requests can use the model:

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
    console.log(res);
});
```


### Run the Model Listing Command:

```sh
$ ollama list
```

### Test:

With is command file will be compiled and it will be loaded on local server [http://localhost:3000/home](http://localhost:3000/home)



## Licensing

Licensed under the [MIT](https://opensource.org/licenses/MIT).

