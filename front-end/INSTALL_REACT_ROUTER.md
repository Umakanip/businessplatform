# Installing React Router

Since PowerShell execution policy is preventing npm from running, you need to install React Router manually:

## Option 1: Use Command Prompt (Recommended)
1. Open Command Prompt (cmd) instead of PowerShell
2. Navigate to the frontend directory: `cd D:\BusinessPlatform\frontend`
3. Run: `npm install react-router-dom @types/react-router-dom`

## Option 2: Change PowerShell Execution Policy
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Navigate to frontend directory: `cd D:\BusinessPlatform\frontend`
4. Run: `npm install react-router-dom @types/react-router-dom`

## Option 3: Use Visual Studio Code Terminal
1. Open the project in VS Code
2. Open Terminal (Ctrl + `)
3. Make sure it's using Command Prompt or Git Bash
4. Run: `npm install react-router-dom @types/react-router-dom`

## After Installation
Once React Router is installed, you can uncomment the routing code in App.tsx and Header.tsx to enable proper navigation between pages.

The current setup shows all components on one page with anchor navigation, which will work for now. 