# About
This is an example of how to use `Function Calling` by OpenAI and connect the response with external API.

Blog post explanation: [Connect OpenAI with external API using function calling](https://serpapi.com/blog/connect-openai-with-external-apis-with-function-calling)

## Use case
In this sample we're building a shopping assistant, with this flow: 
- It reads user input (natural language)
- Extract the important data
- Call an API based on that data
- Response in natural language

## Tools need
- [Function Calling by OpenAI](https://platform.openai.com/docs/guides/function-calling)
- [Google Shopping API by SerpApi](https://serpapi.com/google-shopping-api)

## Run
1. Install packages 
```
npm install
```

2. Copy env_template to .env and fill in your API keys

3. Run the program
```
node index.js
```

Feel free to adjust the prompt inside the program

