.PHONY: backend frontend check test

backend:
	cd backend && npm install && npx ts-node app/app.ts
frontend:
	cd frontend && npm install && npm run dev
check:
	cd backend && npx tsc --noEmit
test:
	cd backend && npm test