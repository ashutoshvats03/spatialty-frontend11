rmdir /s /q node_modules
rmdir /s /q .next
del package-lock.json
npm install
npm run dev



in package.json 
script->dev
// "dev": "next dev --turbopack""# spatialty-frontend" 
