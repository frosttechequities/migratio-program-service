# Recommendation Engine Wireframes

## Overview

This document presents wireframes and user flows for the recommendation engine interface, which displays personalized immigration pathway recommendations based on the user's assessment results. The recommendation interface is a critical component that translates complex matching algorithms into clear, actionable guidance.

## User Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Recommendation │────▶│  Program        │────▶│  Detailed       │
│  Overview       │     │  Card           │     │  Program View   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                                │
        │                                                │
        ▼                                                ▼
┌─────────────────┐                           ┌─────────────────┐
│                 │                           │                 │
│  Filtering and  │                           │  Gap Analysis   │
│  Sorting        │                           │  View           │
│                 │                           │                 │
└─────────────────┘                           └─────────────────┘
        │                                                │
        ▼                                                │
┌─────────────────┐     ┌─────────────────┐             │
│                 │     │                 │             │
│  Comparison     │◀────│  Program        │◀────────────┘
│  View           │     │  Selection      │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│                 │
│  Save/Export    │
│  Options        │
│                 │
└─────────────────┘
```

## Recommendation Overview

### Purpose
- Present personalized immigration recommendations
- Provide a clear summary of matching results
- Enable easy exploration of options

### Wireframe Description

**Header:**
- "Your Immigration Pathways" headline
- Assessment completion date and time
- Profile completeness indicator
- Option to retake or update assessment

**Results Summary:**
- Total number of matching programs found
- Match quality distribution (excellent, good, moderate matches)
- Brief explanation of how matches are calculated
- User profile summary with key factors

**Recommendation List:**
- Sorted by match percentage (highest first)
- Card-based layout for each program
- Visual match strength indicator (percentage and color)
- Country flag and program name
- Program category (work, study, family, investment)
- 2-3 key matching factors highlighted
- Quick action buttons (View Details, Save, Compare)

**Filtering Controls:**
- Filter by country, program type, processing time, cost
- Sort options (match %, processing time, cost, etc.)
- Saved/favorited filter
- Filter chips showing active filters

**No Matches Handling:**
- Supportive message if no strong matches
- Explanation of possible reasons
- Suggestions for profile improvements
- Option to adjust matching criteria
- Alternative pathways to consider

**Actions:**
- "Explore All Programs" option (beyond matches)
- "Download Recommendations" button (PDF)
- "Share Results" option
- "Schedule Consultation" button (premium feature)

## Program Card

### Purpose
- Provide at-a-glance program information
- Show match strength and key factors
- Enable quick actions

### Wireframe Description

**Card Layout:**
- Prominent match percentage (e.g., "87% Match")
- Visual match indicator (color-coded)
- Country flag and name
- Program name and category
- Processing time estimate
- Cost range indicator

**Key Matching Factors:**
- 2-3 strongest matching factors highlighted
- Visual indicators for strength of each factor
- Brief explanation of why these factors match

**Potential Challenges:**
- 1-2 potential gap areas highlighted
- Severity indicator for each challenge
- Quick link to gap analysis

**Quick Actions:**
- "View Details" primary button
- Save/favorite toggle
- "Add to Compare" checkbox
- "View Roadmap" link (premium feature)

**Visual States:**
- Default state
- Hover/focus state
- Selected for comparison state
- Saved/favorited state

**Additional Information:**
- Program popularity indicator
- Recent policy change indicator (if applicable)
- Premium content indicator (if applicable)

## Detailed Program View

### Purpose
- Provide comprehensive program information
- Show detailed match analysis
- Enable informed decision-making

### Wireframe Description

**Header:**
- Program name and country
- Match percentage and visual indicator
- Program category and subcategory
- Back to recommendations link

**Program Overview:**
- Official program description
- Key eligibility requirements
- Processing time range
- Cost breakdown
- Links to official sources

**Match Analysis:**
- Detailed breakdown of match percentage
- Category scores (education, work experience, language, etc.)
- Visualization of strengths and weaknesses
- Explanation of scoring methodology

**Eligibility Criteria:**
- Comprehensive list of all requirements
- User's status for each criterion (met, partially met, not met)
- Visual indicators for each criterion status
- Details on how user meets or falls short of requirements

**Application Process:**
- Step-by-step application process
- Estimated timeline visualization
- Document requirements
- Key milestones and decision points

**Additional Information:**
- Success rate statistics (if available)
- Recent policy changes affecting this program
- Alternative or related programs
- Common challenges and solutions

**Actions:**
- "Create Roadmap" primary button (premium feature)
- "Add to Saved Programs" button
- "Add to Comparison" button
- "Download Program Details" option
- "Share" option

## Gap Analysis View

### Purpose
- Identify areas where user doesn't meet requirements
- Provide actionable recommendations for improvement
- Quantify impact of addressing gaps

### Wireframe Description

**Header:**
- "Gap Analysis" headline
- Program name and current match percentage
- Potential match percentage if gaps addressed

**Gap Summary:**
- Number and severity of identified gaps
- Estimated time to address all gaps
- Potential match improvement percentage
- Visual before/after comparison

**Gap List:**
- Each gap as a card or list item
- Gap severity indicator (critical, moderate, minor)
- Current user value vs. required value
- Estimated time to address each gap
- Difficulty level indicator

**Improvement Recommendations:**
- Specific actions to address each gap
- Resources and tools available
- Estimated cost to address (if applicable)
- Alternative approaches when available

**Impact Simulation:**
- Interactive tool to see impact of addressing specific gaps
- Match percentage recalculation
- Timeline adjustment based on selected improvements
- Cost estimation for selected improvements

**Actions:**
- "Add Improvements to Roadmap" button
- "Save Analysis" option
- "Compare with Other Programs" link
- "Explore Alternative Programs" option

## Filtering and Sorting

### Purpose
- Enable customized view of recommendations
- Allow prioritization based on user preferences
- Support exploration of different scenarios

### Wireframe Description

**Filter Panel:**
- Expandable/collapsible panel
- Clear all filters option
- Save filter combination feature
- Filter count indicator

**Filter Categories:**
- Country (multi-select with flags)
- Program Type (work, study, family, investment)
- Processing Time (range slider)
- Cost Range (range slider)
- Match Percentage (range slider)
- Special Features (checkbox list)

**Active Filters Display:**
- Horizontal chip list of active filters
- Clear individual filter option
- Clear all filters button
- Filter summary text

**Sorting Controls:**
- Dropdown or toggle buttons for sort options
- Sort by match percentage (default)
- Sort by processing time (fastest first)
- Sort by cost (lowest first)
- Sort by country (alphabetical)
- Sort by program popularity

**Search Option:**
- Search box for keyword filtering
- Autocomplete suggestions
- Recent searches display

**Filter Presets:**
- "Fastest Pathways" preset
- "Budget-Friendly Options" preset
- "Highest Match" preset
- "Easiest Qualification" preset
- Custom saved presets

## Program Selection

### Purpose
- Enable selection of programs for comparison
- Provide efficient multi-selection interface
- Support decision-making process

### Wireframe Description

**Selection Mode:**
- Toggle between normal and selection mode
- Clear visual indication of selection mode
- Selection count indicator

**Selection Interface:**
- Checkbox on each program card
- Selected state styling
- Batch selection options (select all, none)
- Filter-based selection ("Select all work programs")

**Selection Limit:**
- Maximum selection indicator (e.g., "Select up to 3 programs")
- Warning when approaching limit
- Explanation if limit is reached

**Selected Programs Summary:**
- Miniature cards or list of selected programs
- Quick remove option for each selection
- Clear all selections button

**Actions:**
- "Compare Selected" primary button
- "Save Selection" option
- "Create Roadmaps" option (premium feature)
- "Cancel" to exit selection mode

## Comparison View

### Purpose
- Enable side-by-side comparison of programs
- Highlight differences and similarities
- Support informed decision-making

### Wireframe Description

**Header:**
- "Program Comparison" headline
- Programs being compared (names and countries)
- Option to add/remove programs
- Match percentage for each program

**Comparison Table:**
- Programs as columns
- Categories and criteria as rows
- Visual indicators for better/worse values
- Highlighting of significant differences

**Comparison Categories:**
- Basic Information (type, category, etc.)
- Eligibility Requirements
- Processing Time
- Cost Breakdown
- Application Process
- Benefits and Limitations
- Pathway to Permanent Residence
- User Match Analysis

**Visual Comparison:**
- Radar chart comparing key dimensions
- Bar charts for numerical comparisons
- Color coding for better/worse values
- Icons for feature presence/absence

**Gap Comparison:**
- Number and severity of gaps for each program
- Estimated time to address gaps
- Difficulty comparison

**Actions:**
- "Save Comparison" button
- "Export to PDF" option
- "Add to Roadmap" option (premium feature)
- "Share Comparison" option
- "Return to Recommendations" link

## Save/Export Options

### Purpose
- Provide options for preserving recommendation data
- Enable sharing and offline access
- Support decision documentation

### Wireframe Description

**Save Options:**
- Save to user account (default)
- Create collection/folder
- Add notes or tags
- Set reminder for follow-up

**Export Formats:**
- PDF document
- Printable version
- Email summary
- Calendar events for key dates

**PDF Customization:**
- Select sections to include
- Detail level (summary vs. comprehensive)
- Include/exclude gap analysis
- Add personal notes

**Sharing Options:**
- Direct link (with access controls)
- Email to specific recipients
- Share with immigration advisor
- Social media sharing (optional)

**Preview:**
- Document preview before export
- Estimated file size
- Mobile-friendly indicator

**Actions:**
- "Generate Document" primary button
- "Save Settings as Default" option
- "Cancel" link
- Premium features indicator where applicable

## Mobile Considerations

The recommendation interface is designed to be fully responsive with mobile-specific optimizations:

- Vertical stacking of program cards
- Swipeable comparison view
- Collapsible filter panel accessible via button
- Touch-friendly selection controls
- Simplified visualizations for smaller screens
- Bottom navigation bar for key actions
- Progressive disclosure of detailed information

## Accessibility Considerations

- Screen reader support for match percentages and visualizations
- Keyboard navigation for all interactive elements
- Sufficient color contrast for match indicators
- Alternative text for all visual elements
- Focus management for modal dialogs
- ARIA landmarks for major sections
- Descriptive labels for all controls

## User Testing Focus Areas

1. Comprehension of match percentages and factors
2. Effectiveness of filtering and sorting controls
3. Usefulness of gap analysis recommendations
4. Clarity of program comparisons
5. Decision confidence after using the interface
6. Mobile usability of complex comparison features

## Next Steps

1. Stakeholder review of recommendation display approach
2. Usability testing with representative users
3. Refinement based on feedback
4. Development of interactive prototype
5. Integration with recommendation algorithm
6. Visual design application
