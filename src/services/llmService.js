const { AzureOpenAI } = require('openai');



class LLMService {
  constructor() {
    this.openai = new AzureOpenAI({
      apiKey: process.env.GPT4O_KEY2,
      baseURL: process.env.GPT4O_ENDPOINT2,
      apiVersion: "2024-02-15-preview",
    });
    console.log('LLM Service initialized');
  }

  async generateResponse(messages, settings = {}) {
    try {
        console.log('Generating response with settings:', settings);  // Debug log
        
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-greg",
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            temperature: settings.temperature ?? 0.1,
            max_tokens: settings.max_tokens ?? 8000,
            top_p: settings.top_p ?? 1,
            frequency_penalty: settings.frequency_penalty ?? 0,
            presence_penalty: settings.presence_penalty ?? 0
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating LLM response:', error);
        throw error;
    }
  }
}

module.exports = new LLMService(); 