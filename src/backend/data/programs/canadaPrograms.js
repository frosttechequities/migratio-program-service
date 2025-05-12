/**
 * Sample immigration programs for Canada
 */
const canadaPrograms = [
  {
    name: 'Express Entry - Federal Skilled Worker Program',
    description: 'For skilled workers with foreign work experience who want to immigrate to Canada permanently.',
    fullDescription: `The Federal Skilled Worker Program (FSWP) is one of the immigration programs managed through Express Entry. 
    
    The FSWP is for skilled workers with foreign work experience who want to immigrate to Canada permanently. To be eligible for the FSWP, you must:
    
    1. Have at least one year of continuous full-time (or equivalent part-time) skilled work experience in the past 10 years
    2. Have a Canadian Language Benchmark (CLB) of at least 7 in all language abilities in English or French
    3. Have a Canadian educational credential or foreign credential with an Educational Credential Assessment (ECA)
    4. Score at least 67 points out of 100 on the FSWP selection factors
    5. Show proof of funds to support yourself and your family in Canada (unless you have a valid job offer)
    
    The Express Entry system uses the Comprehensive Ranking System (CRS) to rank candidates. The highest-ranking candidates are invited to apply for permanent residence through regular draws.`,
    country: 'Canada',
    category: 'economic',
    processingTime: '6-12 months',
    criteria: [
      {
        name: 'Age',
        description: 'Candidates between 18 and 35 receive maximum points',
        category: 'personal_info',
        key: 'age',
        weight: 12,
        minValue: 18,
        maxValue: 45,
        options: [
          { value: [18, 35], label: '18-35 years', points: 12 },
          { value: [36, 40], label: '36-40 years', points: 10 },
          { value: [41, 45], label: '41-45 years', points: 5 },
          { value: [46, 100], label: '46+ years', points: 0 }
        ]
      },
      {
        name: 'Education',
        description: 'Higher education levels receive more points',
        category: 'education',
        key: 'education_level',
        weight: 25,
        options: [
          { value: 'doctorate', label: 'Doctorate (PhD)', points: 25 },
          { value: 'masters', label: 'Master\'s Degree', points: 23 },
          { value: 'two_or_more_degrees', label: 'Two or more post-secondary credentials, one being 3+ years', points: 22 },
          { value: 'bachelors', label: 'Bachelor\'s Degree', points: 21 },
          { value: 'three_year_diploma', label: 'Three-year post-secondary diploma', points: 19 },
          { value: 'two_year_diploma', label: 'Two-year post-secondary diploma', points: 17 },
          { value: 'one_year_diploma', label: 'One-year post-secondary diploma', points: 15 },
          { value: 'high_school', label: 'High school diploma', points: 5 },
          { value: 'none', label: 'No education', points: 0 }
        ]
      },
      {
        name: 'Work Experience',
        description: 'More years of skilled work experience receive more points',
        category: 'work_experience',
        key: 'years_of_experience',
        weight: 15,
        minValue: 1,
        maxValue: 6,
        options: [
          { value: 1, label: '1 year', points: 9 },
          { value: 2, label: '2-3 years', points: 11 },
          { value: 4, label: '4-5 years', points: 13 },
          { value: 6, label: '6+ years', points: 15 }
        ]
      },
      {
        name: 'Language Proficiency (English/French)',
        description: 'Higher language proficiency receives more points',
        category: 'language',
        key: 'language_proficiency',
        weight: 28,
        minValue: 7,
        maxValue: 10,
        options: [
          { value: 10, label: 'CLB 10+', points: 28 },
          { value: 9, label: 'CLB 9', points: 26 },
          { value: 8, label: 'CLB 8', points: 22 },
          { value: 7, label: 'CLB 7', points: 16 },
          { value: 6, label: 'CLB 6', points: 8 },
          { value: 5, label: 'CLB 5', points: 4 },
          { value: 4, label: 'CLB 4 or less', points: 0 }
        ]
      },
      {
        name: 'Adaptability',
        description: 'Factors that help you adapt to life in Canada',
        category: 'adaptability',
        key: 'adaptability_factors',
        weight: 10,
        options: [
          { value: 'spouse_education', label: 'Spouse\'s education', points: 4 },
          { value: 'previous_study', label: 'Previous study in Canada', points: 5 },
          { value: 'previous_work', label: 'Previous work in Canada', points: 5 },
          { value: 'job_offer', label: 'Job offer in Canada', points: 5 },
          { value: 'relatives', label: 'Relatives in Canada', points: 5 }
        ]
      },
      {
        name: 'Job Offer',
        description: 'Valid job offer from a Canadian employer',
        category: 'work_experience',
        key: 'job_offer',
        weight: 10,
        options: [
          { value: true, label: 'Yes', points: 10 },
          { value: false, label: 'No', points: 0 }
        ]
      }
    ],
    benefits: [
      'Permanent residence status upon arrival',
      'Access to healthcare and social benefits',
      'Right to live, work, or study anywhere in Canada',
      'Path to Canadian citizenship',
      'Ability to sponsor eligible relatives'
    ],
    requirements: [
      'Minimum 1 year of skilled work experience',
      'Language proficiency (CLB 7 or higher)',
      'Educational credentials assessment',
      'Minimum 67 points on selection factors',
      'Proof of funds (unless you have a valid job offer)'
    ]
  },
  {
    name: 'Express Entry - Canadian Experience Class',
    description: 'For skilled workers who have Canadian work experience and want to become permanent residents.',
    fullDescription: `The Canadian Experience Class (CEC) is for skilled workers who have Canadian work experience and want to become permanent residents. It's one of the three programs managed through Express Entry.

    To be eligible for the CEC, you must:
    
    1. Have at least 1 year of skilled work experience in Canada in the last 3 years
    2. Have gained your experience with proper authorization
    3. Meet the required language levels (CLB 7 for NOC 0 or A jobs, CLB 5 for NOC B jobs)
    
    The CEC has no education requirements, but you can earn more points in Express Entry if you have a Canadian or foreign educational credential.`,
    country: 'Canada',
    category: 'economic',
    processingTime: '4-8 months',
    criteria: [
      {
        name: 'Canadian Work Experience',
        description: 'At least 1 year of skilled work experience in Canada within the last 3 years',
        category: 'work_experience',
        key: 'canadian_experience',
        weight: 35,
        minValue: 1,
        maxValue: 3,
        options: [
          { value: 3, label: '3+ years', points: 35 },
          { value: 2, label: '2 years', points: 28 },
          { value: 1, label: '1 year', points: 20 },
          { value: 0, label: 'None', points: 0 }
        ]
      },
      {
        name: 'Language Proficiency',
        description: 'Meet minimum language requirements based on NOC skill level',
        category: 'language',
        key: 'language_proficiency',
        weight: 30,
        minValue: 5,
        maxValue: 10,
        options: [
          { value: 10, label: 'CLB 10+', points: 30 },
          { value: 9, label: 'CLB 9', points: 27 },
          { value: 8, label: 'CLB 8', points: 23 },
          { value: 7, label: 'CLB 7', points: 19 },
          { value: 6, label: 'CLB 6', points: 15 },
          { value: 5, label: 'CLB 5', points: 10 },
          { value: 4, label: 'CLB 4 or less', points: 0 }
        ]
      },
      {
        name: 'Age',
        description: 'Candidates between 18 and 35 receive maximum points',
        category: 'personal_info',
        key: 'age',
        weight: 12,
        minValue: 18,
        maxValue: 45,
        options: [
          { value: [18, 35], label: '18-35 years', points: 12 },
          { value: [36, 40], label: '36-40 years', points: 10 },
          { value: [41, 45], label: '41-45 years', points: 5 },
          { value: [46, 100], label: '46+ years', points: 0 }
        ]
      },
      {
        name: 'Education',
        description: 'Higher education levels receive more points',
        category: 'education',
        key: 'education_level',
        weight: 15,
        options: [
          { value: 'doctorate', label: 'Doctorate (PhD)', points: 15 },
          { value: 'masters', label: 'Master\'s Degree', points: 13 },
          { value: 'bachelors', label: 'Bachelor\'s Degree', points: 12 },
          { value: 'diploma', label: 'Post-secondary diploma', points: 10 },
          { value: 'high_school', label: 'High school diploma', points: 5 },
          { value: 'none', label: 'No education', points: 0 }
        ]
      },
      {
        name: 'Job Offer',
        description: 'Valid job offer from a Canadian employer',
        category: 'work_experience',
        key: 'job_offer',
        weight: 8,
        options: [
          { value: true, label: 'Yes', points: 8 },
          { value: false, label: 'No', points: 0 }
        ]
      }
    ],
    benefits: [
      'Faster processing times compared to other programs',
      'No need for Educational Credential Assessment',
      'No proof of funds required',
      'Permanent residence status upon approval',
      'Path to Canadian citizenship'
    ],
    requirements: [
      'At least 1 year of skilled work experience in Canada',
      'Experience gained with proper authorization',
      'Meet language requirements (CLB 7 for NOC 0/A, CLB 5 for NOC B)',
      'Plan to live outside Quebec'
    ]
  },
  {
    name: 'Provincial Nominee Program (PNP)',
    description: 'Programs run by provinces and territories to nominate immigrants who wish to settle in that region.',
    fullDescription: `The Provincial Nominee Program (PNP) allows Canadian provinces and territories to nominate individuals who wish to immigrate to Canada and who are interested in settling in a particular province.

    Each province and territory has its own PNP streams and criteria for selecting nominees based on their specific economic and demographic needs. Some PNP streams are aligned with Express Entry, while others operate independently.
    
    Express Entry-linked PNP streams offer a faster processing time, while base PNP streams typically take longer but may have different or less demanding requirements.
    
    A provincial nomination through an Express Entry-linked stream gives you an additional 600 points in the Comprehensive Ranking System (CRS), virtually guaranteeing an invitation to apply for permanent residence.`,
    country: 'Canada',
    category: 'economic',
    processingTime: '12-18 months (base PNP), 6-8 months (Express Entry-linked PNP)',
    criteria: [
      {
        name: 'Connection to Province',
        description: 'Factors that demonstrate your connection to the province',
        category: 'adaptability',
        key: 'provincial_connection',
        weight: 25,
        options: [
          { value: 'job_offer', label: 'Job offer in the province', points: 25 },
          { value: 'work_experience', label: 'Work experience in the province', points: 20 },
          { value: 'education', label: 'Education in the province', points: 20 },
          { value: 'family', label: 'Family in the province', points: 15 },
          { value: 'visit', label: 'Previous visit to the province', points: 5 },
          { value: 'none', label: 'No connection', points: 0 }
        ]
      },
      {
        name: 'Work Experience',
        description: 'Years of work experience in relevant occupation',
        category: 'work_experience',
        key: 'years_of_experience',
        weight: 20,
        minValue: 0,
        maxValue: 5,
        options: [
          { value: 5, label: '5+ years', points: 20 },
          { value: 4, label: '4 years', points: 16 },
          { value: 3, label: '3 years', points: 12 },
          { value: 2, label: '2 years', points: 8 },
          { value: 1, label: '1 year', points: 4 },
          { value: 0, label: 'None', points: 0 }
        ]
      },
      {
        name: 'Education',
        description: 'Level of education completed',
        category: 'education',
        key: 'education_level',
        weight: 20,
        options: [
          { value: 'doctorate', label: 'Doctorate (PhD)', points: 20 },
          { value: 'masters', label: 'Master\'s Degree', points: 18 },
          { value: 'bachelors', label: 'Bachelor\'s Degree', points: 16 },
          { value: 'diploma', label: 'Post-secondary diploma', points: 14 },
          { value: 'high_school', label: 'High school diploma', points: 8 },
          { value: 'none', label: 'No education', points: 0 }
        ]
      },
      {
        name: 'Language Proficiency',
        description: 'Proficiency in English or French',
        category: 'language',
        key: 'language_proficiency',
        weight: 20,
        minValue: 4,
        maxValue: 10,
        options: [
          { value: 10, label: 'CLB 10+', points: 20 },
          { value: 9, label: 'CLB 9', points: 18 },
          { value: 8, label: 'CLB 8', points: 16 },
          { value: 7, label: 'CLB 7', points: 14 },
          { value: 6, label: 'CLB 6', points: 12 },
          { value: 5, label: 'CLB 5', points: 10 },
          { value: 4, label: 'CLB 4', points: 8 },
          { value: 3, label: 'CLB 3 or less', points: 0 }
        ]
      },
      {
        name: 'Age',
        description: 'Age at time of application',
        category: 'personal_info',
        key: 'age',
        weight: 15,
        minValue: 18,
        maxValue: 50,
        options: [
          { value: [18, 35], label: '18-35 years', points: 15 },
          { value: [36, 40], label: '36-40 years', points: 12 },
          { value: [41, 45], label: '41-45 years', points: 8 },
          { value: [46, 50], label: '46-50 years', points: 4 },
          { value: [51, 100], label: '51+ years', points: 0 }
        ]
      }
    ],
    benefits: [
      'Targeted immigration based on provincial needs',
      'May have lower requirements than federal programs',
      'Express Entry-linked nominations add 600 CRS points',
      'Some streams cater to specific occupations or regions',
      'Permanent residence status upon approval'
    ],
    requirements: [
      'Meet the criteria of the specific provincial stream',
      'Demonstrate intention to settle in the nominating province',
      'Have the skills, education, and work experience to contribute to the province\'s economy',
      'Meet minimum language requirements',
      'Have sufficient funds to support yourself and your family'
    ]
  }
];

module.exports = canadaPrograms;
