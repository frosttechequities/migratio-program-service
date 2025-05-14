# Website Q&A RAG Chatbot Guide

This guide explains how to build a chatbot that can answer questions about website content using Retrieval Augmented Generation (RAG).

## Guide Overview

By the end of this guide, you will use a PostgreSQL database, LangChain, and an LLM API to build an application that will let you chat with a website of your choice.

An application like this could be very useful to create a chatbot that:
- Answers questions on a company's documentation
- Provides summaries of blogs you like to read

## What is RAG?

Retrieval Augmented Generation (RAG) is a technique that enhances large language models by providing them with relevant information retrieved from external sources. In this case, we'll retrieve information from a website to help the model answer questions accurately.

## Components

### Vector Database
We'll use a PostgreSQL database with pgvector extension to store vector embeddings of website content. This allows for efficient similarity search.

### LangChain
LangChain is an open-source framework that makes building, productionizing, and deploying applications with Large Language Models (LLMs) easier. We will use LangChain to parse the website, convert the content to embeddings, and query against the database.

### LLM API
We'll use an LLM API (like Gemini API) to convert website text to embeddings and to generate responses based on retrieved content.

## Implementation Steps

1. Set up the environment and install required packages
2. Configure the LLM API
3. Set up a PostgreSQL database with pgvector
4. Create embeddings client
5. Create a vector store
6. Scrape website content using sitemap.xml
7. Generate embeddings and store them
8. Set up a method to ask questions
9. Create a frontend interface
10. Deploy the application

## Folder Structure

This folder contains all the necessary files and images from the original guide, adapted to work with Augment Code and Gemini API instead of Replit and OpenAI.

- `README.md` - This overview file
- `images/` - Screenshots and diagrams from the guide
- `code/` - Code samples from the guide
- `implementation/` - Adapted implementation for our environment

## Next Steps

After completing this guide, you can:
1. Customize the chatbot for specific websites
2. Improve the UI for better user experience
3. Add features like conversation history
4. Deploy to a production environment
