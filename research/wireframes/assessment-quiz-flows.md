# Assessment Quiz Wireframes

## Overview

This document presents wireframes and user flows for the assessment quiz, which is a core feature of the Migratio platform. The quiz collects comprehensive user information to generate personalized immigration recommendations.

## User Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Quiz           │────▶│  Question       │────▶│  Question       │
│  Introduction   │     │  Type A         │     │  Type B         │
│                 │     │  (Single Choice) │     │  (Multiple)     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Question       │◀────│  Question       │◀────│  Question       │
│  Type E         │     │  Type D         │     │  Type C         │
│  (File Upload)  │     │  (Date Input)   │     │  (Slider)       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Section        │────▶│  Additional     │────▶│  Quiz           │
│  Complete       │     │  Questions      │     │  Complete       │
│                 │     │  (Conditional)  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │                 │
                                               │  Results        │
                                               │  Preview        │
                                               │                 │
                                               └─────────────────┘
```

## Quiz Introduction

### Purpose
- Set expectations for the assessment process
- Explain the value of completing the quiz
- Prepare users for the types of questions they'll answer

### Wireframe Description

**Header:**
- Logo and "Immigration Assessment Quiz" headline
- Progress indicator (0% complete)

**Main Content:**
- Brief explanation of the assessment purpose
- Key benefits of completing the assessment
- Estimated time to complete (10-15 minutes)
- Types of information needed (education, work experience, etc.)
- Privacy reassurance with link to privacy policy

**Quiz Structure Overview:**
- Visual representation of quiz sections
- Number of questions per section

**Actions:**
- Primary CTA: "Begin Assessment" button
- Secondary CTA: "Save for Later" link
- "Quick Assessment Option" link (for users with limited time)

**Additional Features:**
- Option to enable email reminders if quiz is abandoned
- Language selection for multilingual users

## Question Type A: Single Choice

### Purpose
- Collect information with mutually exclusive options
- Simple, clear decision points
- Quick response for straightforward questions

### Wireframe Description

**Header:**
- Section indicator (e.g., "Personal Information")
- Question number and total (e.g., "Question 2 of 7")
- Progress bar showing completion percentage

**Question Display:**
- Clear question text (e.g., "What is your highest level of education?")
- Help text explaining why this information matters
- Information icon with additional context in tooltip

**Answer Options:**
- Radio button list with 5-7 options
- Clear labels for each option
- Visual spacing between options for clarity

**Navigation:**
- "Next" button (enabled only when an option is selected)
- "Back" button to review previous questions
- "Save and Continue Later" link

**Additional Features:**
- Keyboard navigation support (arrow keys, space to select)
- Automatic advance option (when selection is made)

## Question Type B: Multiple Choice

### Purpose
- Collect information where multiple selections are valid
- Allow comprehensive response capture
- Support complex scenarios

### Wireframe Description

**Header:**
- Similar to Single Choice question

**Question Display:**
- Clear question text (e.g., "Which countries are you interested in immigrating to?")
- Instruction text clarifying multiple selection is allowed
- Help text explaining impact on recommendations

**Answer Options:**
- Checkbox list with options
- Option to select "All that apply"
- Search/filter for long option lists (e.g., country selection)
- Most common options highlighted or grouped

**Navigation:**
- Similar to Single Choice question
- "Next" button enabled even without selection (if question is optional)

**Additional Features:**
- "Select All" and "Clear All" options for convenience
- Grouping of related options when appropriate
- Counter showing number of selected items

## Question Type C: Slider

### Purpose
- Collect numerical or range-based information
- Provide visual representation of spectrum
- Simplify numerical input

### Wireframe Description

**Header:**
- Similar to previous question types

**Question Display:**
- Clear question text (e.g., "What is your budget for immigration expenses?")
- Help text explaining the impact of this factor

**Slider Control:**
- Horizontal slider with clear minimum and maximum values
- Current selection displayed prominently
- Visual markers for significant thresholds
- Labels for key points on the scale

**Value Display:**
- Numerical value updates as slider moves
- Units clearly indicated (e.g., USD, years, etc.)
- Optional text input for precise value entry

**Navigation:**
- Similar to previous question types

**Additional Features:**
- Touch-friendly design for mobile users
- Snap-to-grid option for certain value ranges
- Visual feedback as slider is adjusted

## Question Type D: Date Input

### Purpose
- Collect specific dates or time periods
- Support chronological information
- Enable timeline-based calculations

### Wireframe Description

**Header:**
- Similar to previous question types

**Question Display:**
- Clear question text (e.g., "When did you complete your highest education?")
- Help text explaining date format and relevance

**Date Input:**
- Calendar picker component
- Month/Year selection for less specific dates
- Text input alternative with format guidance
- Validation for impossible dates

**Time Period Option:**
- Toggle between specific date and time period when appropriate
- Duration input for time periods (years/months)

**Navigation:**
- Similar to previous question types
- Validation ensures date is in acceptable range

**Additional Features:**
- Relative date options (e.g., "Not yet completed")
- Approximate date option when exact date is unknown
- Age calculation display when birthdate is entered

## Question Type E: File Upload

### Purpose
- Collect supporting documentation
- Enable credential verification
- Support detailed assessment

### Wireframe Description

**Header:**
- Similar to previous question types

**Question Display:**
- Clear question text (e.g., "Upload your resume or CV")
- Help text explaining acceptable file formats and size limits
- Note about how the document will be used

**Upload Interface:**
- Drag-and-drop area with clear border
- "Browse Files" button alternative
- File type icons indicating accepted formats
- Maximum file size clearly indicated

**Upload Status:**
- Progress indicator during upload
- Success confirmation with file name and size
- Preview option for uploaded documents
- Delete option to remove and try again

**Navigation:**
- "Next" button (may be enabled even without upload if optional)
- "Skip for Now" option for optional documents

**Additional Features:**
- Multiple file upload when appropriate
- Document type selection dropdown
- Brief description field for uploaded files
- Mobile camera integration for document scanning

## Section Complete

### Purpose
- Provide sense of progress and accomplishment
- Summarize information collected so far
- Prepare for next section

### Wireframe Description

**Header:**
- "Section Complete" headline with checkmark icon
- Progress bar showing overall completion

**Summary Content:**
- Congratulatory message
- Name of completed section
- Key information collected (summarized)
- Name of next section with brief description

**Review Option:**
- "Review Your Answers" expandable section
- Quick edit links for each question in the section

**Actions:**
- Primary CTA: "Continue to Next Section" button
- "Save and Continue Later" link with email reminder option

**Additional Features:**
- Estimated time remaining to complete full assessment
- Progress statistics (e.g., "3 of 7 sections complete")

## Additional Questions (Conditional)

### Purpose
- Gather deeper information based on previous answers
- Adapt to user's specific situation
- Collect relevant details only when needed

### Wireframe Description

**Header:**
- Similar to standard questions
- Indication that these are follow-up questions

**Context Display:**
- Brief explanation of why these additional questions are being asked
- Reference to previous answer that triggered these questions

**Question Format:**
- Follows same patterns as standard question types
- May be grouped together if closely related
- Simplified navigation for quick completion

**Navigation:**
- "Next" button to continue
- "Back" option to revise previous answers

**Additional Features:**
- Collapsible sections for related follow-up questions
- Estimated additional time for these questions
- Option to skip detailed follow-ups (with impact warning)

## Quiz Complete

### Purpose
- Confirm successful completion of assessment
- Set expectations for next steps
- Transition to recommendations

### Wireframe Description

**Header:**
- "Assessment Complete!" headline with celebration icon
- 100% progress indicator

**Completion Message:**
- Congratulatory text
- Summary of information provided
- Explanation of what happens next

**Processing Indication:**
- Animation showing recommendation generation
- Estimated time until results are ready (if not immediate)
- Explanation of matching process

**Actions:**
- Primary CTA: "View Your Recommendations" button
- "Save PDF Summary" option for assessment answers
- "Edit Your Responses" link to review and modify

**Additional Features:**
- Option to receive results by email
- Social share option (e.g., "I just completed my immigration assessment")
- Prompt to create account (if started as guest)

## Results Preview

### Purpose
- Provide immediate value after quiz completion
- Preview personalized recommendations
- Encourage deeper exploration

### Wireframe Description

**Header:**
- "Your Immigration Pathways" headline
- User name and assessment date

**Results Summary:**
- Number of matching programs found
- Top 3 recommended pathways with match percentages
- Visual match strength indicators

**Top Recommendation Highlight:**
- Featured card for highest match
- Key matching factors
- Quick action buttons (View Details, Save, Compare)

**Next Steps Guidance:**
- Clear call to action for exploring full results
- Explanation of additional features available
- Subscription tier information if relevant

**Actions:**
- "Explore All Recommendations" primary button
- "Download Full Report" option (premium feature indicator)
- "Retake Assessment" link

**Additional Features:**
- Recommendation filtering options
- Email results option
- Schedule consultation option (premium feature)

## Mobile Considerations

The quiz is designed to be fully responsive with mobile-specific optimizations:

- Single question per screen for focused experience
- Touch-optimized input controls
- Simplified progress indicators
- Collapsible help text to save space
- Persistent navigation fixed at bottom of screen
- Save state maintained across sessions
- Reduced vertical scrolling where possible

## Accessibility Considerations

- All form controls are keyboard navigable
- Screen reader compatibility for all questions
- Clear focus states for interactive elements
- Error messages are descriptive and linked to inputs
- Alternative text for all visual elements
- Sufficient color contrast for all text
- No time limits on question responses
- Option to increase text size

## User Testing Focus Areas

1. Question clarity and comprehension
2. Time to complete full assessment
3. Completion rate and abandonment points
4. Mobile vs. desktop completion rates
5. User confidence in accuracy of information provided
6. Perceived value of the assessment process

## Next Steps

1. Stakeholder review of question flow
2. Content development for all questions
3. Usability testing of question formats
4. Refinement based on user feedback
5. Development of adaptive logic rules
6. Integration with recommendation engine
