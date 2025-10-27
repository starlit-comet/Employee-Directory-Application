@echo off
echo Installing dependencies...
npm install

echo.
echo Starting Next.js development server...
echo Make sure the GraphQL server is running on http://localhost:3489
echo.
npm run dev
