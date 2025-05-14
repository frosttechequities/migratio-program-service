import { DOMParser } from "xmldom";
import { train } from "./train.js";

/**
 * Extract URLs from a sitemap XML string.
 * @param {string} xmlString - The XML string to parse.
 * @returns {string[]} - Array of URLs extracted from the sitemap.
 */
function makeURLs(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const urls = xmlDoc.getElementsByTagName("url");
  const urlList = [];
  
  for (let i = 0; i < urls.length; i++) {
    const loc = urls[i].getElementsByTagName("loc")[0];
    if (loc) {
      urlList.push(loc.textContent);
    }
  }
  
  return urlList;
}

/**
 * Scrape a website using its sitemap.xml and train the chatbot on the content.
 * @param {string} url - The base URL of the website to scrape.
 */
export async function scrapeWebsite(url) {
  console.log(`Scraping website: ${url}`);
  
  try {
    // Fetch the sitemap
    const sitemapURL = `${url}/sitemap.xml`;
    console.log(`Fetching sitemap from: ${sitemapURL}`);
    
    const response = await fetch(sitemapURL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
    }
    
    const xmlString = await response.text();
    
    // Extract URLs from the sitemap
    const urls = makeURLs(xmlString);
    console.log(`Found ${urls.length} URLs in sitemap`);
    
    // Train the chatbot on the extracted URLs
    await train(urls);
    
    return urls;
  } catch (error) {
    console.error("Error scraping website:", error);
    throw error;
  }
}
