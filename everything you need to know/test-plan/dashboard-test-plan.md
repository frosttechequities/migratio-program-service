# Dashboard Test Plan

This document outlines a structured approach to testing the dashboard components in smaller, more manageable chunks. By breaking down the tests into smaller units, we can more easily identify and fix issues.

## Test Categories

1. **Widget Rendering Tests** - Test each widget component in isolation
2. **Data Handling Tests** - Test how components handle different data scenarios
3. **Redux Integration Tests** - Test integration with Redux store
4. **User Interaction Tests** - Test user interactions with components
5. **Error Handling Tests** - Test error handling in components

## Test Commands

Use these commands to run specific test groups:

```bash
# Run a specific test file
npm test -- src/features/dashboard/components/__tests__/WidgetName.test.js

# Run tests matching a specific pattern
npm test -- --testNamePattern="WidgetName renders correctly"

# Run tests with coverage
npm test -- --coverage --collectCoverageFrom="src/features/dashboard/**/*.js"
```

## Widget-Specific Test Plans

### 1. WelcomeWidget

**Test File:** `src/features/dashboard/__tests__/WelcomeWidget.test.js`

**Test Cases:**
- Renders with minimal props
- Renders with complete props
- Handles undefined/null props
- Displays user name correctly
- Displays stats correctly
- Handles button click correctly

**Command:**
```bash
npm test -- --testNamePattern="WelcomeWidget"
```

### 2. JourneyProgressWidget

**Test File:** `src/features/dashboard/__tests__/JourneyProgressWidget.test.js`

**Test Cases:**
- Renders with default props
- Renders with specific stage index
- Handles undefined/null props
- Displays correct stage labels
- Displays correct active stage

**Command:**
```bash
npm test -- --testNamePattern="JourneyProgressWidget"
```

### 3. RecommendationSummaryWidget

**Test File:** `src/features/dashboard/__tests__/RecommendationSummaryWidget.test.js`

**Test Cases:**
- Renders with empty recommendations
- Renders with valid recommendations
- Handles undefined/null props
- Displays correct number of recommendations
- Handles "View All" button click

**Command:**
```bash
npm test -- --testNamePattern="RecommendationSummaryWidget"
```

### 4. UpcomingTasksWidget

**Test File:** `src/features/dashboard/__tests__/UpcomingTasksWidget.test.js`

**Test Cases:**
- Renders with empty tasks
- Renders with valid tasks
- Handles undefined/null props
- Displays correct number of tasks
- Handles task completion toggle
- Displays correct task priorities

**Command:**
```bash
npm test -- --testNamePattern="UpcomingTasksWidget"
```

### 5. DocumentCenterWidget

**Test File:** `src/features/dashboard/__tests__/DocumentCenterWidget.test.js`

**Test Cases:**
- Renders with empty documents
- Renders with valid documents
- Handles undefined/null props
- Displays correct document stats
- Displays correct document list
- Handles "View" button click

**Command:**
```bash
npm test -- --testNamePattern="DocumentCenterWidget"
```

### 6. ResourceRecommendationsWidget

**Test File:** `src/features/dashboard/__tests__/ResourceRecommendationsWidget.test.js`

**Test Cases:**
- Renders in loading state
- Renders with empty resources
- Renders with valid resources
- Handles undefined/null props
- Displays error state correctly
- Handles "View All" button click

**Command:**
```bash
npm test -- --testNamePattern="ResourceRecommendationsWidget"
```

### 7. GlobalOpportunitiesWidget

**Test File:** `src/features/dashboard/__tests__/GlobalOpportunitiesWidget.test.js`

**Test Cases:**
- Renders correctly
- Handles button clicks correctly

**Command:**
```bash
npm test -- --testNamePattern="GlobalOpportunitiesWidget"
```

### 8. DestinationSuggestionsWidget

**Test File:** `src/features/dashboard/__tests__/DestinationSuggestionsWidget.test.js`

**Test Cases:**
- Renders in loading state
- Renders with empty suggestions
- Renders with valid suggestions
- Handles undefined/null props
- Displays error state correctly

**Command:**
```bash
npm test -- --testNamePattern="DestinationSuggestionsWidget"
```

## Data Handling Test Plan

### Empty Data Tests

**Test Cases:**
- Components render correctly with empty arrays
- Components render correctly with null/undefined data
- Components show appropriate empty state messages

**Command:**
```bash
npm test -- --testNamePattern="handles empty data"
```

### Malformed Data Tests

**Test Cases:**
- Components handle missing properties gracefully
- Components handle incorrect data types gracefully
- Components don't crash with unexpected data structures

**Command:**
```bash
npm test -- --testNamePattern="handles malformed data"
```

## Error Handling Test Plan

**Test Cases:**
- Components display error messages correctly
- Components recover gracefully from errors
- Error boundaries catch and display component errors

**Command:**
```bash
npm test -- --testNamePattern="handles error state"
```

## Integration Test Plan

**Test Cases:**
- Dashboard page renders all widgets correctly
- Widgets interact with Redux store correctly
- Data fetching works correctly
- User preferences are saved and loaded correctly

**Command:**
```bash
npm test -- src/pages/dashboard/__tests__/DashboardIntegration.test.js
```

## Test Execution Strategy

1. Start with individual widget rendering tests
2. Move to data handling tests for each widget
3. Test error handling for each widget
4. Run integration tests
5. Fix issues as they are discovered
6. Re-run tests to verify fixes

By following this structured approach, we can systematically identify and fix issues in the dashboard components.
