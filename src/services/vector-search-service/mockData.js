/**
 * Mock Data for Vector Search Service
 * 
 * This file contains mock data for the vector search service.
 * It includes pre-processed chunks from the immigration research documents.
 */

const mockDocuments = [
  {
    id: 1,
    content: "The Express Entry system is Canada's flagship immigration management system for key economic immigration programs. Launched in January 2015, Express Entry is not an immigration program itself but rather a system used to manage applications for permanent residence under three federal economic immigration programs: Federal Skilled Worker Program (FSWP), Federal Skilled Trades Program (FSTP), and Canadian Experience Class (CEC). Additionally, provinces and territories can recruit candidates from the Express Entry pool through their Provincial Nominee Programs (PNPs) to meet local labor market needs.",
    metadata: {
      title: "Express Entry Program Guide",
      source: "Immigration Canada",
      tags: ["canada", "express entry", "immigration"]
    },
    similarity: 0.92
  },
  {
    id: 2,
    content: "The Comprehensive Ranking System (CRS) is a points-based system used to rank eligible candidates in the Express Entry pool. The maximum score is 1,200 points, divided into: Core/Human Capital Factors (up to 500 points), Spouse or Common-Law Partner Factors (up to 40 points), Skill Transferability Factors (up to 100 points), and Additional Points (up to 600 points). Core factors include age, level of education, official language proficiency, and Canadian work experience.",
    metadata: {
      title: "Express Entry Program Guide",
      source: "Immigration Canada",
      tags: ["canada", "express entry", "points system"]
    },
    similarity: 0.88
  },
  {
    id: 3,
    content: "To be eligible for Express Entry, candidates must meet the requirements of at least one of the three federal immigration programs. For the Federal Skilled Worker Program (FSWP), you need skilled work experience, language skills (minimum CLB 7), education, and a score of at least 67 points on the FSWP points grid. For the Federal Skilled Trades Program (FSTP), you need skilled trades experience, language skills, and a valid job offer or certificate. For the Canadian Experience Class (CEC), you need Canadian work experience and language skills.",
    metadata: {
      title: "Express Entry Program Guide",
      source: "Immigration Canada",
      tags: ["canada", "express entry", "eligibility"]
    },
    similarity: 0.85
  },
  {
    id: 4,
    content: "When applying for immigration to any country, proper documentation is crucial for a successful application. Essential identity documents include a valid passport (must be valid for at least 6 months beyond your intended period of stay), previous passports, birth certificate, marriage certificate (if applicable), divorce certificate/decree (if previously married), and national identity documents. These documents establish your identity and personal history.",
    metadata: {
      title: "Document Requirements for Immigration",
      source: "Immigration Resources",
      tags: ["documents", "identity", "immigration"]
    },
    similarity: 0.90
  },
  {
    id: 5,
    content: "Language proficiency documentation is essential for most immigration applications. For English, accepted tests include IELTS (International English Language Testing System), CELPIP (Canadian English Language Proficiency Index Program), TOEFL (Test of English as a Foreign Language), PTE Academic (Pearson Test of English), and OET (Occupational English Test). For French, accepted tests include TEF Canada (Test d'évaluation de français) and TCF Canada (Test de connaissance du français).",
    metadata: {
      title: "Document Requirements for Immigration",
      source: "Immigration Resources",
      tags: ["documents", "language testing", "immigration"]
    },
    similarity: 0.87
  },
  {
    id: 6,
    content: "Educational documentation required for immigration typically includes high school diploma/certificate with transcript of grades, college/university degrees (Bachelor's, Master's, PhD), transcripts from all post-secondary institutions, professional certifications, and trade qualifications. For foreign education credentials, an Educational Credential Assessment (ECA) is often required, such as WES evaluation for US and Canada, VETASSESS for Australia, or UK NARIC/ENIC for the United Kingdom.",
    metadata: {
      title: "Document Requirements for Immigration",
      source: "Immigration Resources",
      tags: ["documents", "education", "immigration"]
    },
    similarity: 0.84
  },
  {
    id: 7,
    content: "Language proficiency is a critical component of the immigration process for many countries. Most developed countries require proof of language proficiency as part of their immigration process. This requirement serves several purposes: integration potential, economic success, self-sufficiency, public safety, and civic participation. Language skills are strong predictors of successful integration into a new society and correlate with better employment outcomes and higher earnings.",
    metadata: {
      title: "Language Testing for Immigration",
      source: "Immigration Resources",
      tags: ["language testing", "proficiency", "immigration"]
    },
    similarity: 0.93
  },
  {
    id: 8,
    content: "The IELTS (International English Language Testing System) is the most widely accepted English language test for immigration purposes worldwide. It has two versions: IELTS General Training for immigration to Canada, Australia, New Zealand, and the UK, and IELTS Academic for study permits. The test format includes Listening (30 minutes), Reading (60 minutes), Writing (60 minutes), and Speaking (11-14 minutes). Scores range from 0-9 in 0.5 increments, and the test is valid for 2 years.",
    metadata: {
      title: "Language Testing for Immigration",
      source: "Immigration Resources",
      tags: ["language testing", "IELTS", "immigration"]
    },
    similarity: 0.89
  },
  {
    id: 9,
    content: "For Canadian immigration, language requirements vary by program. The Federal Skilled Worker Program requires minimum CLB 7 (Canadian Language Benchmark), which corresponds to IELTS General scores of Listening 6.0, Reading 6.0, Writing 6.0, and Speaking 6.0. The Federal Skilled Trades Program requires minimum CLB 5 for speaking and listening, CLB 4 for reading and writing. The Canadian Experience Class requires CLB 7 for NOC 0 or A jobs, and CLB 5 for NOC B jobs.",
    metadata: {
      title: "Language Testing for Immigration",
      source: "Immigration Resources",
      tags: ["language testing", "canada", "immigration"]
    },
    similarity: 0.86
  },
  {
    id: 10,
    content: "Medical examinations are a mandatory component of most immigration processes worldwide. These examinations serve to ensure that applicants do not pose a public health risk to the destination country and that they will not place excessive demands on health and social services. Immigration medical examinations must be performed by physicians specifically authorized by the immigration authorities of the destination country, such as panel physicians or civil surgeons.",
    metadata: {
      title: "Medical Examinations for Immigration",
      source: "Immigration Resources",
      tags: ["medical", "health", "immigration"]
    },
    similarity: 0.91
  },
  {
    id: 11,
    content: "Standard components of immigration medical examinations typically include a medical history review, physical examination, laboratory tests (chest X-ray, urinalysis, blood tests), and additional tests when indicated. After completing the examination, the physician will complete the required immigration medical forms, provide a sealed envelope containing the results, submit results directly to immigration authorities, and provide the applicant with a copy of certain results.",
    metadata: {
      title: "Medical Examinations for Immigration",
      source: "Immigration Resources",
      tags: ["medical", "examination", "immigration"]
    },
    similarity: 0.88
  },
  {
    id: 12,
    content: "Medical examination results typically have a limited validity period: 12 months for Canada, 3-6 months for the United States (depending on the condition), 12 months for Australia, 3 months for New Zealand, and 3-6 months for the United Kingdom. If your medical results expire before your application is processed, you may need to undergo another examination.",
    metadata: {
      title: "Medical Examinations for Immigration",
      source: "Immigration Resources",
      tags: ["medical", "validity", "immigration"]
    },
    similarity: 0.85
  },
  {
    id: 13,
    content: "Points-based immigration systems are structured frameworks used by many countries to select skilled immigrants based on their potential to contribute economically and integrate successfully into society. These systems assign points for various attributes such as age, education, work experience, language proficiency, and adaptability factors. Candidates who score above a certain threshold become eligible for immigration consideration.",
    metadata: {
      title: "Points-Based Immigration Systems",
      source: "Immigration Resources",
      tags: ["points system", "skilled immigration", "immigration"]
    },
    similarity: 0.94
  },
  {
    id: 14,
    content: "Canada's Express Entry system uses the Comprehensive Ranking System (CRS) to score and rank candidates. The maximum score is 1,200 points, with points allocated for core/human capital factors (up to 500 points), spouse or common-law partner factors (up to 40 points), skill transferability factors (up to 100 points), and additional points (up to 600 points). Provincial/Territorial nomination provides 600 points, while a valid job offer provides 50 or 200 points depending on the position.",
    metadata: {
      title: "Points-Based Immigration Systems",
      source: "Immigration Resources",
      tags: ["points system", "canada", "express entry"]
    },
    similarity: 0.90
  },
  {
    id: 15,
    content: "Australia's General Skilled Migration program uses a points test with a minimum threshold of 65 points. Points are allocated for age (maximum 30 points), English language ability (maximum 20 points), skilled employment experience (maximum 20 points), educational qualifications (maximum 20 points), and other factors such as Australian study, specialist education qualification, community language, study in regional Australia, partner skills, and professional year.",
    metadata: {
      title: "Points-Based Immigration Systems",
      source: "Immigration Resources",
      tags: ["points system", "australia", "skilled migration"]
    },
    similarity: 0.87
  }
];

module.exports = {
  mockDocuments
};
