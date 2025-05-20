# Dashboard Micro Tests Prompt

This document provides a structured prompt to guide the testing process using the micro tests approach. The goal is to break down tests into extremely small, focused units that produce outputs small enough to read and understand.

## Prompt for Running Micro Tests

```
I need help testing the Dashboard Experience Optimization using a micro tests approach. This approach involves running very small, focused tests that test only one specific aspect of a component at a time.

I've created a MicroTests.test.js file in src/frontend/src/features/dashboard/__tests__/ that contains small, focused tests for various dashboard components.

Please help me:

1. Run the tests in MicroTests.test.js
2. Analyze the test results to identify any issues
3. Fix the issues in the actual application code (not just the tests)
4. Re-run the tests to verify the fixes
5. Update the progress tracking table in the dashboard_testing_prompts.md file

Let's start by running the tests for the DocumentCenterWidget component:

```bash
cd C:\\Users\\USER\\Documents\\Migratio\\src\\frontend
npm test -- --testNamePattern="DocumentCenterWidget renders with empty documents"
```

After we've fixed any issues with that component, we'll move on to the next component.
```

## Prompt for Adding More Micro Tests

```
I need help adding more micro tests to the MicroTests.test.js file. Let's focus on adding tests for the following components:

1. GlobalOpportunitiesWidget
2. ProgramComparisonView
3. DashboardLayout

For each component, we need to add tests for:
- Basic rendering with minimal props
- Rendering with valid data
- Handling undefined props
- User interactions (button clicks, etc.)
- Error states

Please help me:

1. Examine the existing components to understand their structure and props
2. Add appropriate test cases to MicroTests.test.js
3. Run the new tests to identify any issues
4. Fix the issues in the actual application code
5. Update the progress tracking table in the dashboard_testing_prompts.md file

Let's start with the GlobalOpportunitiesWidget component.
```

## Prompt for Testing User Interactions

```
I need help testing user interactions in the dashboard components. Let's focus on the following components:

1. JourneyProgressWidget
2. UpcomingTasksWidget
3. ResourceRecommendationsWidget
4. DestinationSuggestionsWidget

For each component, we need to test:
- Button clicks
- Form submissions
- Checkbox toggles
- Dropdown selections
- Any other interactive elements

Please help me:

1. Add user interaction tests to MicroTests.test.js
2. Run the tests to identify any issues
3. Fix the issues in the actual application code
4. Update the progress tracking table in the dashboard_testing_prompts.md file

Let's start with the JourneyProgressWidget component.
```

## Prompt for Testing Integration

```
I need help testing the integration between dashboard components and the Redux store. Let's focus on:

1. How components receive data from the Redux store
2. How user interactions update the Redux store
3. How changes in the Redux store affect component rendering

Please help me:

1. Add integration tests to MicroTests.test.js
2. Run the tests to identify any issues
3. Fix the issues in the actual application code
4. Update the progress tracking table in the dashboard_testing_prompts.md file

Let's start by testing how the WelcomeWidget component integrates with the Redux store.
```

## Prompt for Testing Error Handling

```
I need help testing error handling in the dashboard components. Let's focus on how components handle:

1. Undefined or null props
2. Empty arrays
3. Malformed data
4. Network errors
5. Redux store errors

Please help me:

1. Add error handling tests to MicroTests.test.js
2. Run the tests to identify any issues
3. Fix the issues in the actual application code
4. Update the progress tracking table in the dashboard_testing_prompts.md file

Let's start by testing how the ProgramComparisonView component handles error states.
```

## Prompt for Final Verification

```
I need help performing a final verification of the Dashboard Experience Optimization. Let's:

1. Run all the micro tests to ensure everything passes
2. Check for any remaining issues
3. Verify that all components handle edge cases correctly
4. Ensure that all components integrate properly with the Redux store
5. Update the progress tracking table in the dashboard_testing_prompts.md file

Let's start by running all the tests in MicroTests.test.js:

```bash
cd C:\\Users\\USER\\Documents\\Migratio\\src\\frontend
npm test -- src/features/dashboard/__tests__/MicroTests.test.js
```

After we've verified that all tests pass, we'll update the documentation to reflect the current state of the Dashboard Experience Optimization.
```

## How to Use This Document

1. Start with the "Prompt for Running Micro Tests" to run the existing tests
2. Use the "Prompt for Adding More Micro Tests" to add tests for components that haven't been tested yet
3. Use the "Prompt for Testing User Interactions" to test interactive elements
4. Use the "Prompt for Testing Integration" to test Redux integration
5. Use the "Prompt for Testing Error Handling" to test error states
6. Finish with the "Prompt for Final Verification" to ensure everything works correctly

## Best Practices for Micro Tests

1. **Focus on One Thing**: Each test should focus on testing exactly one aspect of a component
2. **Keep Tests Small**: Tests should be small enough that their output is easy to read and understand
3. **Use Descriptive Names**: Test names should clearly describe what is being tested
4. **Test Real Components**: Use real components instead of mocks whenever possible
5. **Fix Application Code**: When tests fail, fix the actual application code, not just the tests
6. **Re-run Tests**: After fixing issues, re-run the tests to verify the fixes
7. **Track Progress**: Keep the progress tracking table updated as tests are completed

## Example Test Output Analysis

When a test fails, carefully analyze the error message to understand the issue:

```
FAIL src/features/dashboard/__tests__/MicroTests.test.js
  Dashboard Micro Tests
    DocumentCenterWidget
      ✓ renders with empty documents (132 ms)
      ✕ renders with valid documents (152 ms)
      ✓ handles undefined props (45 ms)
```

In this example, the "renders with valid documents" test is failing. Look at the error message to understand why:

```
Expected element with text "Passport" to be in the document, but it wasn't found.
```

This indicates that the DocumentCenterWidget component isn't correctly displaying the document name. Check the component code to see how it's accessing the document name property and fix any issues.
