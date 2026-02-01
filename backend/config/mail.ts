import { User } from "@modules/users/users.types";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export function buildAdminRegistrationEmail(user: User) {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f7f9; padding:24px">
    <div style="max-width:600px; background:#ffffff; margin:0 auto; padding:24px; border-radius:12px">
      <h2 style="margin-top:0; color:#333">🆕 Новая регистрация пользователя</h2>

      <table style="width:100%; border-collapse:collapse; margin-top:16px">
        <tr>
          <td style="padding:8px 0; color:#777">ID</td>
          <td style="padding:8px 0"><b>${user.id}</b></td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#777">Email</td>
          <td style="padding:8px 0">${user.email}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#777">Логин</td>
          <td style="padding:8px 0">${user.login}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#777">Телефон</td>
          <td style="padding:8px 0">${user.numberPhone || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#777">Роль</td>
          <td style="padding:8px 0">${user.role}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#777">Дата регистрации</td>
          <td style="padding:8px 0">${new Date().toLocaleString()}</td>
        </tr>
      </table>

      <div style="margin-top:24px; padding-top:16px; border-top:1px solid #eee; color:#999; font-size:12px">
        Уведомление отправлено автоматически
      </div>
    </div>
  </div>
  `;
}

export function buildUserConfirmedEmail(user: User) {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f7f9; padding:24px">
    <div style="max-width:600px; background:#ffffff; margin:0 auto; padding:24px; border-radius:12px">
      <h2 style="margin-top:0; color:#2e7d32">✅ Аккаунт подтверждён</h2>

      <p style="color:#333; font-size:15px">
        Привет, <b>${user.login}</b> 👋
      </p>

      <p style="color:#555; font-size:14px">
        Ваш аккаунт был успешно подтверждён администратором.
        Теперь вам доступны все функции сервиса.
      </p>

      <div style="margin:24px 0; padding:16px; background:#f1f8e9; border-radius:8px">
        <p style="margin:0; color:#2e7d32; font-size:14px">
          🎉 Добро пожаловать!  
        </p>
      </div>

      <p style="color:#777; font-size:13px">
        Если вы не регистрировались — просто проигнорируйте это письмо.
      </p>

      <div style="margin-top:24px; padding-top:16px; border-top:1px solid #eee; color:#999; font-size:12px">
        © OilTransport
      </div>
    </div>
  </div>
  `;
}
