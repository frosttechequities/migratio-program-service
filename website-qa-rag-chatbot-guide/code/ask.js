import { ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { loadVectorStore } from "./vectorStore.js";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

/**
 * Ask a question to the AI chatbot.
 * @param {string} input - The question to ask.
 * @returns {Promise<string>} - The answer from the chatbot.
 */
export async function question(input) {
  console.log(`Question: ${input}`);
  
  try {
    // Load the vector store
    const vectorStore = await loadVectorStore();
    
    // Create a retriever from the vector store
    const retriever = vectorStore.asRetriever();
    
    // Get the retrieval QA chat prompt from LangChain Hub
    const retrievalQAChatPrompt = await pull("langchain-ai/retrieval-qa-chat");
    
    // Initialize the ChatOpenAI model
    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: "gpt-3.5-turbo",
    });
    
    // Create a chain for combining documents
    const combineDocsChain = await createStuffDocumentsChain({
      llm,
      prompt: retrievalQAChatPrompt,
    });
    
    // Create a retrieval chain
    const retrievalChain = await createRetrievalChain({
      retriever,
      combineDocsChain,
    });
    
    // Execute the chain with the input question
    const result = await retrievalChain.invoke({
      input,
    });
    
    console.log("Answer:", result.answer);
    return result.answer;
  } catch (error) {
    console.error("Error asking question:", error);
    throw error;
  }
}
