import Anthropic from '@anthropic-ai/sdk'
import { ChatAnthropic } from '@langchain/anthropic'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'

import config from '~/src/config.js'

const MODEL = 'claude-3-5-haiku-20241022'

const SYSTEM_TEMPLATE = `Answer the user as if you were an expert GDS copywriter.
Reply with a concise declarative phrase describing the form field heading they have entered.
If the user enters a declarative phrase or word, return the phrase or word verbatim.
Do not wrap the answer in quotations or apostrophes.
Do not end the answer in a full stop.
Replace 'Do you...' with 'Whether you...'.
Questions should be reorganised into a declarative phrase, for example ‘What is your name?’ -> ‘Your name’, ‘Age’ -> ‘Age’.
Declarative phrases should be left untouched, for example ‘Deadline date’ -> ‘Deadline date’.
If the user includes ‘your’ in the input, include ‘your’ in the output.
If the user doesn't include 'your' in the input, don't include 'your' in the output.
Remove any acronyms or brackets.
`

const promptTemplate = ChatPromptTemplate.fromMessages([
  ['system', SYSTEM_TEMPLATE],
  ['user', '{text}']
])

const model = new ChatAnthropic({
  apiKey: config.ai.anthropic.key,
  model: MODEL,
  maxTokens: config.ai.anthropic.maxTokens,
  temperature: 0.2
})

const chain = RunnableSequence.from([
  promptTemplate,
  model,
  new StringOutputParser()
])

/**
 * @param {string} title
 * @returns {Promise<string>}
 */
export async function langchainJS(title) {
  return await chain.invoke({ text: title })
}

const client = new Anthropic({
  apiKey: config.ai.anthropic.key
})

const cachedAnthropicCall = {
  model: MODEL,
  max_tokens: config.ai.anthropic.maxTokens,
  system: [
    {
      type: 'text',
      text: SYSTEM_TEMPLATE,
      cache_control: { type: 'ephemeral' }
    }
  ],
  messages: []
}

export async function anthropicGetShortDescription(title) {
  const response = await client.messages.create({
    ...cachedAnthropicCall,
    messages: [{ role: 'user', content: title }]
  })
  const [{ text }] = response.content

  return text
}
