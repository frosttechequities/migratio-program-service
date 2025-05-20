# Master Dashboard Test Plan

This document provides an overview of the testing strategy for the Dashboard Experience Optimization. It outlines how to break down tests into the smallest possible units to ensure outputs are manageable and issues can be easily identified.

## Test Plan Structure

The dashboard test plan is divided into several component-specific plans:

1. [Widget Test Plan](./widget-test-plan.md) - Tests for individual dashboard widgets
2. [Visual Roadmap Test Plan](./visual-roadmap-test-plan.md) - Tests for the enhanced visual roadmap
3. [Recommendation Display Test Plan](./recommendation-display-test-plan.md) - Tests for the improved recommendation display
4. [Layout and Integration Test Plan](./layout-integration-test-plan.md) - Tests for dashboard layout and integration

## Testing Approach

To ensure test outputs are small enough to read and understand, we follow these principles:

1. **Micro-Tests**: Each test focuses on a single, specific aspect of functionality
2. **Precise Test Patterns**: Use specific test name patterns to run only the exact test needed
3. **Isolated Components**: Test components in isolation before testing their integration
4. **Progressive Testing**: Start with simple rendering tests, then move to more complex scenarios

## Test Execution Order

Follow this order to systematically identify and fix issues:

### Phase 1: Basic Component Rendering

Test that each component renders without crashing:

```bash
# Test individual widgets
npm test -- --testNamePattern="WelcomeWidget renders with minimal props"
npm test -- --testNamePattern="JourneyProgressWidget renders with default props"
npm test -- --testNamePattern="RecommendationSummaryWidget renders with empty recommendations"
npm test -- --testNamePattern="UpcomingTasksWidget renders with empty tasks"
npm test -- --testNamePattern="DocumentCenterWidget renders with empty documents"
npm test -- --testNamePattern="ResourceRecommendationsWidget renders in loading state"
npm test -- --testNamePattern="GlobalOpportunitiesWidget renders correctly"
npm test -- --testNamePattern="DestinationSuggestionsWidget renders in loading state"

# Test visual roadmap components
npm test -- --testNamePattern="TimelineVisualization renders with empty data"
npm test -- --testNamePattern="MilestoneTracker renders with empty data"
npm test -- --testNamePattern="StepByStepGuide renders with empty data"

# Test recommendation display components
npm test -- --testNamePattern="ProgramComparisonView renders with empty data"
npm test -- --testNamePattern="ProgramInfoCard renders with minimal data"
npm test -- --testNamePattern="SuccessProbabilityVisualization renders with minimal data"
npm test -- --testNamePattern="FilteringSortingControls renders correctly"

# Test layout components
npm test -- --testNamePattern="DashboardLayout renders with minimal props"
npm test -- --testNamePattern="DashboardHeader renders correctly"
npm test -- --testNamePattern="DashboardControls renders correctly"
npm test -- --testNamePattern="DashboardPage renders with minimal state"
```

### Phase 2: Data Handling

Test how components handle different data scenarios:

```bash
# Test widgets with valid data
npm test -- --testNamePattern="WelcomeWidget displays user name correctly"
npm test -- --testNamePattern="JourneyProgressWidget displays current stage correctly"
npm test -- --testNamePattern="RecommendationSummaryWidget renders with valid recommendations"
npm test -- --testNamePattern="UpcomingTasksWidget renders with valid tasks"
npm test -- --testNamePattern="DocumentCenterWidget renders with valid documents"
npm test -- --testNamePattern="ResourceRecommendationsWidget renders with valid resources"
npm test -- --testNamePattern="DestinationSuggestionsWidget renders with valid suggestions"

# Test visual roadmap with valid data
npm test -- --testNamePattern="TimelineVisualization renders with complete data"
npm test -- --testNamePattern="MilestoneTracker displays milestone list correctly"
npm test -- --testNamePattern="StepByStepGuide displays steps correctly"

# Test recommendation display with valid data
npm test -- --testNamePattern="ProgramComparisonView renders with program data"
npm test -- --testNamePattern="ProgramInfoCard renders with complete data"
npm test -- --testNamePattern="SuccessProbabilityVisualization displays probability correctly"
```

### Phase 3: User Interaction

Test how components respond to user interactions:

```bash
# Test widget interactions
npm test -- --testNamePattern="RecommendationSummaryWidget handles View All button click"
npm test -- --testNamePattern="UpcomingTasksWidget handles task completion toggle"
npm test -- --testNamePattern="DocumentCenterWidget handles Manage Documents button click"
npm test -- --testNamePattern="GlobalOpportunitiesWidget handles button clicks correctly"

# Test visual roadmap interactions
npm test -- --testNamePattern="TimelineVisualization handles zoom controls correctly"
npm test -- --testNamePattern="TimelineVisualization handles range slider correctly"
npm test -- --testNamePattern="MilestoneTracker handles click events correctly"
npm test -- --testNamePattern="StepByStepGuide handles navigation correctly"

# Test recommendation display interactions
npm test -- --testNamePattern="ProgramComparisonView handles filtering correctly"
npm test -- --testNamePattern="ProgramComparisonView handles sorting correctly"
npm test -- --testNamePattern="ProgramInfoCard handles click events correctly"
npm test -- --testNamePattern="FilteringSortingControls handles filtering correctly"
npm test -- --testNamePattern="FilteringSortingControls handles sorting correctly"

# Test layout interactions
npm test -- --testNamePattern="DashboardLayout handles widget visibility correctly"
npm test -- --testNamePattern="DashboardLayout handles widget reordering correctly"
npm test -- --testNamePattern="DashboardControls handles layout changes correctly"
npm test -- --testNamePattern="DashboardControls handles widget visibility correctly"
```

### Phase 4: Error Handling

Test how components handle error states:

```bash
# Test widget error handling
npm test -- --testNamePattern="WelcomeWidget handles undefined props"
npm test -- --testNamePattern="JourneyProgressWidget handles undefined props"
npm test -- --testNamePattern="RecommendationSummaryWidget handles undefined props"
npm test -- --testNamePattern="UpcomingTasksWidget handles undefined props"
npm test -- --testNamePattern="DocumentCenterWidget handles undefined props"
npm test -- --testNamePattern="ResourceRecommendationsWidget displays error state correctly"
npm test -- --testNamePattern="DestinationSuggestionsWidget displays error state correctly"

# Test visual roadmap error handling
npm test -- --testNamePattern="TimelineVisualization handles error states"

# Test recommendation display error handling
npm test -- --testNamePattern="ProgramComparisonView handles error states"
npm test -- --testNamePattern="ProgramInfoCard handles malformed data"
npm test -- --testNamePattern="SuccessProbabilityVisualization handles malformed data"

# Test layout error handling
npm test -- --testNamePattern="DashboardLayout handles widget errors"
npm test -- --testNamePattern="DashboardPage handles data fetch errors"
```

### Phase 5: Redux Integration

Test integration with Redux store:

```bash
# Test Redux basics
npm test -- --testNamePattern="Dashboard Redux initial state is correct"
npm test -- --testNamePattern="Dashboard Redux action creators work correctly"
npm test -- --testNamePattern="Dashboard Redux reducers handle actions correctly"
npm test -- --testNamePattern="Dashboard Redux selectors return correct data"
npm test -- --testNamePattern="Dashboard Redux async actions work correctly"

# Test Redux integration
npm test -- --testNamePattern="Dashboard widgets receive correct data from Redux"
npm test -- --testNamePattern="Dashboard user interactions update Redux store"
```

### Phase 6: Persistence

Test data persistence:

```bash
npm test -- --testNamePattern="Dashboard layout changes are persisted"
npm test -- --testNamePattern="Dashboard widget visibility is persisted"
npm test -- --testNamePattern="DashboardPage handles user preferences correctly"
```

### Phase 7: Component Integration

Test how components work together:

```bash
npm test -- --testNamePattern="Visual Roadmap components integrate correctly"
npm test -- --testNamePattern="Recommendation Display components integrate correctly"
npm test -- --testNamePattern="Visual Roadmap integrates with dashboard"
npm test -- --testNamePattern="Recommendation Display integrates with dashboard"
```

## Issue Resolution Strategy

1. **Identify**: Run the smallest test that isolates the issue
2. **Fix**: Make the minimal change needed to fix the issue
3. **Verify**: Re-run the test to confirm the fix works
4. **Expand**: Run related tests to ensure the fix doesn't break other functionality

## Conclusion

By following this highly focused approach, we can systematically identify and fix issues in the Dashboard Experience Optimization without getting overwhelmed by large test outputs.
