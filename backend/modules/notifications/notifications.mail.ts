import { User } from "@modules/users/users.types";
import {
  transporter,
  buildAdminRegistrationEmail,
  buildUserConfirmedEmail,
} from "../../config/mail";

export async function sendWelcomeEmail(user: { email: string; login: string }) {
  await transporter.sendMail({
    from: "no-reply@yourapp.ru",
    to: user.email,
    subject: "Добро пожаловать!",
    html: `
      <h2>Привет, ${user.login} 👋</h2>
      <p>Ты успешно зарегистрировался в нашем сервисе.</p>
    `,
  });
}

export async function sendEmailToAdmins(user: User) {
  await transporter.sendMail({
    from: "no-reply@yourapp.ru",
    to: "admin@yourapp.ru",
    subject: "Новая регистрация пользователя",
    text: buildAdminRegistrationEmail(user),
  });
}

export async function sendUserConfirmedEmail(user: User) {
  await transporter.sendMail({
    from: '"YourApp" <no-reply@yourapp.ru>',
    to: user.email,
    subject: "Ваш аккаунт подтверждён ✅",
    html: buildUserConfirmedEmail(user),
  });
}
