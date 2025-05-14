// Initial version of index.js for testing
import { scrapeWebsite } from "./scrape.js";
import { question } from "./ask.js";

// Define the website to scrape
const website = "https://docs.replit.com";

// Main function to run the chatbot
async function main() {
  try {
    // Scrape the website and train the chatbot
    await scrapeWebsite(website);
    
    // Ask a question to the chatbot
    const answer = await question("How do you store secrets in Replit?");
    console.log("Answer:", answer);
  } catch (error) {
    console.error("Error running chatbot:", error);
  }
}

// Run the main function
main();

// Updated version of index.js with Express server for frontend
import express from "express";
import { scrapeWebsite } from "./scrape.js";
import { question } from "./ask.js";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Define API routes
app.post("/api/scrape", async (req, res) => {
  try {
    const { url } = req.body;
    const urls = await scrapeWebsite(url);
    res.json({ success: true, urls });
  } catch (error) {
    console.error("Error scraping website:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/ask", async (req, res) => {
  try {
    const { question: userQuestion } = req.body;
    const answer = await question(userQuestion);
    res.json({ success: true, answer });
  } catch (error) {
    console.error("Error asking question:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Scrape a default website on startup
scrapeWebsite("https://docs.replit.com").catch(console.error);
