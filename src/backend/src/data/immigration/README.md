# Immigration Data Collection

This directory contains scripts for collecting real-time immigration program data from official government sources.

## Structure

- `fetchers/`: Contains data fetcher classes for different countries
- `processors/`: Contains data processors to standardize collected data
- `models/`: Contains data models for immigration programs
- `scheduler.js`: Scheduler for regular data updates
- `index.js`: Main entry point for data collection

## Usage

To run a manual data update:

```
npm run update:immigration-data
```

## Data Sources

The data is collected from official government sources:

- Canada: Immigration, Refugees and Citizenship Canada (IRCC)
- Australia: Department of Home Affairs
- New Zealand: Immigration New Zealand
- United Kingdom: UK Visas and Immigration
- United States: U.S. Citizenship and Immigration Services (USCIS)

## Data Freshness

- Data is updated daily to ensure accuracy
- Last update timestamps are stored with each program
- Processing times and fees are verified against official sources

## Data Format

Each immigration program is stored with the following information:

- Program ID
- Program Name
- Country
- Category (Work, Study, Family, Business, etc.)
- Description
- Eligibility Criteria
- Processing Time
- Fees
- Success Rate
- Official Website URL
- Last Updated Timestamp
