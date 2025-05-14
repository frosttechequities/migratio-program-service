/**
 * Mock Data Generator
 * 
 * This script generates mock data for the vector search service.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Sample immigration research data
const immigrationData = [
  {
    title: "Express Entry Program Guide",
    content: "The Express Entry system is used to manage applications for permanent residence under these federal economic immigration programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class. Provinces and territories can also recruit candidates from the Express Entry system through their Provincial Nominee Programs to meet local labor market needs. The Comprehensive Ranking System (CRS) is the points-based system used to assess and score profiles in the Express Entry pool and rank them against each other. It's a different point system than the ones used to assess eligibility for programs that are part of Express Entry.",
    tags: ["canada", "express entry", "immigration", "permanent residence"]
  },
  {
    title: "SkillSelect Points Calculator",
    content: "SkillSelect is an online system that enables skilled workers and business people interested in migrating to Australia to record their details to be considered for a skilled visa through an Expression of Interest (EOI). The points test is a key part of the skilled migration program and is designed to assess the applicant's ability to make a positive contribution to the Australian economy. Points are awarded for age, English language ability, skilled employment experience, educational qualifications, Australian study requirements, regional study, credentialled community language qualifications, and partner skills.",
    tags: ["australia", "skillselect", "points calculator", "immigration"]
  },
  {
    title: "UK Points-Based Immigration System",
    content: "The UK's points-based immigration system prioritizes skills and talent over where a person comes from. The points-based system provides a route for skilled workers who have a job offer from an approved employer sponsor. The job must be at the required skill level of RQF3 or above (equivalent to A level). The worker must speak English and be paid the relevant salary threshold by the sponsor. This will either be the general salary threshold of £25,600 or the going rate for the specific job, whichever is higher.",
    tags: ["uk", "points-based system", "immigration", "skilled worker"]
  },
  {
    title: "Document Requirements for Immigration",
    content: "When applying for immigration, you typically need to provide various documents to support your application. These may include: valid passport or travel document, birth certificate, marriage certificate (if applicable), police certificates, proof of language proficiency, educational credentials assessment, proof of funds, medical examination results, and biometric information. The specific requirements vary depending on the country and immigration program you're applying for. It's important to ensure all documents are properly translated and certified if they're not in the official language of the country you're applying to.",
    tags: ["documents", "requirements", "immigration", "application"]
  },
  {
    title: "Medical Examination for Immigration",
    content: "Most immigration applications require a medical examination to ensure that applicants don't have health conditions that would pose a risk to public health or safety, or would cause excessive demand on health or social services. The medical examination must be performed by a physician approved by the immigration authorities. The examination typically includes a physical examination, chest X-ray, blood tests for HIV and syphilis, and urinalysis. The results are valid for a specific period, usually 6-12 months, depending on the country. If the validity expires before your application is processed, you may need to undergo another examination.",
    tags: ["medical examination", "health", "immigration", "requirements"]
  },
  {
    title: "Language Testing for Immigration",
    content: "Language proficiency is a key requirement for many immigration programs. Accepted language tests vary by country, but common ones include IELTS, CELPIP, TEF, and PTE. The test results are typically valid for 2 years. The required scores vary depending on the immigration program and the country. For example, Canada's Express Entry requires minimum scores in reading, writing, listening, and speaking. Higher scores can significantly increase your chances of receiving an invitation to apply. It's important to prepare thoroughly for these tests, as they can have a significant impact on your immigration application.",
    tags: ["language testing", "proficiency", "immigration", "requirements"]
  },
  {
    title: "Educational Credential Assessment (ECA)",
    content: "An Educational Credential Assessment (ECA) is used to verify that your foreign degree, diploma, or certificate is valid and equal to a credential completed in the destination country. This is often a requirement for immigration applications. The assessment must be done by an organization or professional body designated by the immigration authorities. The ECA report will indicate the equivalent level of education in the destination country. This is important for determining eligibility for certain immigration programs and for calculating points in points-based systems. The ECA is typically valid for 5 years.",
    tags: ["educational credential assessment", "education", "immigration", "requirements"]
  },
  {
    title: "Post-Landing Procedures",
    content: "After arriving in your new country, there are several important procedures to complete. These may include: applying for a social security number or equivalent, obtaining a health insurance card, opening a bank account, finding accommodation, enrolling children in school, and applying for a driver's license. It's also important to understand your tax obligations and to register with your country's embassy or consulate. Some countries offer settlement services to help newcomers navigate these procedures. It's advisable to complete these procedures as soon as possible after arrival.",
    tags: ["post-landing", "settlement", "immigration", "procedures"]
  },
  {
    title: "Family Sponsorship Programs",
    content: "Many countries offer family sponsorship programs that allow citizens and permanent residents to sponsor certain family members for immigration. Eligible family members typically include spouses, common-law partners, dependent children, parents, and grandparents. The sponsor must meet certain income requirements to ensure they can support the sponsored family members. They must also sign an undertaking or sponsorship agreement, committing to provide financial support for a specified period. The sponsored family members must meet health and security requirements. Processing times vary depending on the relationship and the country.",
    tags: ["family sponsorship", "immigration", "family reunification"]
  },
  {
    title: "Citizenship Requirements",
    content: "After living in a country as a permanent resident for a certain period, you may be eligible to apply for citizenship. Requirements typically include: a minimum period of physical presence in the country, language proficiency, knowledge of the country's history, values, and institutions, good character, and intention to reside in the country or maintain a connection to it. Some countries allow dual citizenship, while others require you to renounce your previous citizenship. The application process usually involves a citizenship test and a citizenship ceremony. Citizenship provides additional rights, such as the right to vote and hold a passport.",
    tags: ["citizenship", "naturalization", "immigration", "requirements"]
  }
];

// Function to insert mock data into Supabase
async function insertMockData() {
  console.log('Inserting mock data into Supabase...');
  
  for (const item of immigrationData) {
    console.log(`Processing item: ${item.title}`);
    
    try {
      // Insert the document
      const response = await axios.post(
        'https://qyvvrvthalxeibsmckep.supabase.co/rest/v1/documents',
        {
          content: item.content,
          metadata: {
            title: item.title,
            tags: item.tags,
            source: 'mock-data',
            created_at: new Date().toISOString()
          },
          embedding: Array(768).fill(0).map(() => Math.random() * 2 - 1) // Random embedding
        },
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NzU5ODgsImV4cCI6MjAzMTE1MTk4OH0.Wd0jXKYQQgwIwP0SvCblOmjVBCKzKIxHMrGOq5xUYHE',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NzU5ODgsImV4cCI6MjAzMTE1MTk4OH0.Wd0jXKYQQgwIwP0SvCblOmjVBCKzKIxHMrGOq5xUYHE',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          }
        }
      );
      
      console.log(`Successfully inserted item: ${item.title}`);
    } catch (error) {
      console.error(`Error inserting item ${item.title}:`, error.response?.data || error.message);
    }
  }
  
  console.log('Mock data insertion completed!');
}

// Run the function
insertMockData();
