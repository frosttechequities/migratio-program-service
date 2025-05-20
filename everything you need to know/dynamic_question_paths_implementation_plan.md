# Dynamic Question Paths Implementation Plan

## Overview

The Dynamic Question Paths feature enhances the assessment quiz by:
- Supporting branching logic based on previous answers
- Implementing a question prioritization algorithm
- Adding conditional questions support
- Creating an admin interface for configuring paths
- Implementing question skipping based on relevance

## Implementation Steps

### 1. Create Question Path Service

- [x] Create `questionPathService.js` with core algorithms:
  - [x] `determineNextQuestion` function to handle branching logic
  - [x] `evaluateCondition` function to evaluate branching conditions
  - [x] `isQuestionRelevant` function to check question relevance
  - [x] `getNextPriorityQuestion` function for prioritization
  - [x] `calculateProgress` function for dynamic progress calculation

### 2. Enhance Question Data Structure

- [x] Update sample questions in `assessmentService.js` to include:
  - [x] `nextQuestionLogic` array with condition-based branching
  - [x] `defaultNextQuestionId` for default path
  - [x] `priority` field for question prioritization
  - [x] `relevanceCondition` for conditional display

### 3. Update Assessment Service

- [x] Modify `submitAnswer` function to use the question path service
- [x] Update progress calculation to account for dynamic paths
- [x] Add support for skipping irrelevant questions
- [x] Implement user profile integration for personalized paths
- [x] Implement direct branching logic as a fallback solution

### 4. Update Redux Store

- [x] Add `setPreviousQuestion` reducer to support back navigation
- [x] Update the assessment slice to track question path history
- [x] Enhance state management for dynamic paths

### 5. Update UI Components

- [x] Modify `QuizInterface.js` to support dynamic paths:
  - [x] Add question history tracking
  - [x] Implement back button functionality
  - [x] Update progress display for dynamic paths
  - [x] Add visual indicators for branching questions

### 6. Create Admin Interface

- [x] Create `QuestionPathEditor.js` component:
  - [x] Implement visual editor for defining branching logic
  - [x] Add validation for path configurations
  - [x] Create UI for managing question priorities
  - [x] Implement preview functionality for testing paths

### 7. Testing

- [x] Create test cases for different branching scenarios
- [x] Test back navigation functionality
- [x] Verify progress calculation accuracy
- [x] Test conditional questions and relevance conditions
- [x] Validate question prioritization algorithm
- [x] Implement direct branching logic as a fallback solution when the dynamic path service has issues

## Technical Details

### Question Data Structure

```javascript
{
  id: 'q1',
  text: 'What is your age range?',
  type: 'single_choice',
  options: [...],
  // Branching logic
  nextQuestionLogic: [
    {
      condition: "answer === 'under-18'",
      nextQuestionId: 'q8'
    },
    {
      condition: "answer === '18-24' || answer === '25-29'",
      nextQuestionId: 'q2'
    }
  ],
  // Default next question if no conditions match
  defaultNextQuestionId: 'q5',
  // Question priority (higher number = higher priority)
  priority: 10,
  // Relevance conditions (when to show/skip this question)
  relevanceCondition: "userProfile.hasChildren === true"
}
```

### Branching Logic Algorithm

1. Check if the current question has `nextQuestionLogic`
2. Evaluate each condition in the branching logic
3. If a condition matches, use the specified next question
4. If no conditions match, use the `defaultNextQuestionId`
5. If no default is specified, use the next question in sequence
6. Check if the next question is relevant based on `relevanceCondition`
7. If not relevant, recursively find the next relevant question

### Progress Calculation

Progress is calculated based on:
- Number of answered questions
- Total number of relevant questions for the user
- Question priorities and branching paths

## Future Enhancements

- Implement machine learning to optimize question paths based on user responses
- Add support for adaptive questioning based on response confidence
- Create visualization tools for question path analysis
- Implement A/B testing for different question paths
- Add support for saving and resuming assessment progress
