require("dotenv").config();
const { getJson } = require("serpapi");
const OpenAI = require('openai');

const { SERPAPI_KEY, OPENAI_API_KEY } = process.env;

async function main() {
    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
    });

    const tools = [
      {
        "type": "function",
        "function": {
          "name": "extractShoppingDetail",
          "description": "Extract shopping detail from the user prompt",
          "parameters": {
            "type": "object",
            "properties": {
              "item": {
                "type": "string",
                "description": "The item name"
              },
              "amount": {
                "type": "number",
                "description": "The amount of the item"
              },
              "brand": {
                "type": "string",
                "description": "The brand of the item",
              },
              "price": {
                "type": "number",
                "description": "The price of the item"
              }
            },
            "required": ["query"]
          }
        }
      }
    ]

    const userPrompt = `Holiday is coming. 
                        I have 1 son and 2 daughters. I want them to stay active.
                        So I need running tshirt for them by Nike, and my budget is $10`

    console.log('------- Request for custom function calling ----------')
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": userPrompt}],
        tools: tools,
        tool_choice: "auto"
      });

    const args = completion.choices[0].message.tool_calls[0].function.arguments
    const parsedArgs = JSON.parse(args)

    let apiResult = {}

    try {
        console.log('------- Request for External API ----------')
        apiResult = await getJson({
            engine: "google_shopping",
            api_key: SERPAPI_KEY,
            q: parsedArgs['item'],
            tbs: `mr:1,price:1,ppr_max:${parsedArgs['price']}`,
        });
    } catch (error) {
        console.log('Error running SerpApi search request')
        console.log(error)
    }

    console.log('------- Request for natural language ----------')
    const naturalResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system", "content": "You are a shopping assistant. Provide me the top 3 shopping results. Only get the title, price and link for each item in natural language."},
            {"role": "user", "content": JSON.stringify(apiResult['shopping_results'].slice(0, 3))}
        ],
    })

    console.log(naturalResponse.choices[0].message.content)
}
main()