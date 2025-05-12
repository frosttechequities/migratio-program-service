@echo off
echo Running PDF generation test...
node src\scripts\test-pdf-generation.js

echo.
echo Running PDF generation unit tests...
npx jest --config=jest.config.js src\tests\pdf-generation.service.test.js

echo.
echo Running document management tests...
npx jest --config=jest.config.js src\tests\document-management.test.js

echo.
echo Running document-PDF integration test...
node src\scripts\test-document-pdf-integration.js

echo.
echo All tests completed!
