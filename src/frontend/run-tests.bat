@echo off
echo Running Roadmap component tests...
npx jest --config=jest.config.js src\features\roadmap\components\__tests__

echo.
echo All tests completed!
