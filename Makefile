.PHONY: backend

backend:
	cd backend && npx ts-node app/app.ts
frontend:
	cd frontend && npm install && npm run dev