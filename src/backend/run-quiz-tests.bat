@echo off
echo Running Quiz Engine Service tests...
npx jest --config=jest.config.js src\tests\quiz-engine.service.test.js

echo.
echo All tests completed!
