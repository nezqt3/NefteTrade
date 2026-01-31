.PHONY: backend frontend

backend:
	cd backend && npm install && npx ts-node app/app.ts
frontend:
	cd frontend && npm install && npm run dev