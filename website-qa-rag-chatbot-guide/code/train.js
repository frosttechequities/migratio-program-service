import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitter";
import { loadVectorStore } from "./vectorStore.js";

/**
 * Train the AI chatbot on the content of the provided URLs.
 * @param {string[]} urls - Array of URLs to scrape and train on.
 */
export async function train(urls) {
  console.log("Training on URLs:", urls);
  
  // Load the vector store
  const vectorStore = await loadVectorStore();
  
  // Process each URL
  for (const url of urls) {
    try {
      console.log(`Processing ${url}`);
      
      // Load the webpage using CheerioWebBaseLoader
      const loader = new CheerioWebBaseLoader(url);
      const docs = await loader.load();
      
      // Split the document into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splitDocs = await textSplitter.splitDocuments(docs);
      
      // Add the documents to the vector store
      await vectorStore.addDocuments(splitDocs);
      
      console.log(`Added ${splitDocs.length} document chunks from ${url}`);
    } catch (error) {
      console.error(`Error processing ${url}:`, error);
    }
  }
  
  console.log("Training complete!");
}
