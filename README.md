# NefteTrade

```env
PORT=4000
```

```bash
GET  /api/v1/auth/register    → регистрация пользователя
GET  /api/v1/auth/login       → авторизация пользователя
GET  /api/v1/auth/logout      → разлогинивание
GET  /api/v1/auth/me          → данные текущего пользователя (только для авторизованных)
GET  /api/v1/auth/public      → публичный endpoint, без авторизации
GET  /api/v1/auth/admin       → доступно только для роли "admin"
```
