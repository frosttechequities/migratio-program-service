import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { loadVectorStore } from "./vectorStore.js";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { PromptTemplate } from "@langchain/core/prompts";

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
    
    // Create a custom prompt template for retrieval QA
    const promptTemplate = PromptTemplate.fromTemplate(`
      You are a helpful assistant that answers questions based on the provided context.
      
      Context:
      {context}
      
      Question: {input}
      
      Answer the question based only on the provided context. If you don't know the answer, say that you don't know.
    `);
    
    // Initialize the ChatGoogleGenerativeAI model
    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "gemini-1.5-pro", // Using Gemini 1.5 Pro model
      maxOutputTokens: 1024,
    });
    
    // Create a chain for combining documents
    const combineDocsChain = await createStuffDocumentsChain({
      llm,
      prompt: promptTemplate,
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
