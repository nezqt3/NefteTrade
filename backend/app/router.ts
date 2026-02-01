import { app as AppRouter } from "./app";
import AuthRouter from "../modules/auth/auth.routes";
import ListingsRouter from "../modules/listings/listings.routes";
import UsersRouter from "../modules/users/users.routes";
import PaymentsRouter from "../modules/payments/payments.routes";
import OrdersRouter from "../modules/orders/orders.routes";

AppRouter.use("/api/v1/auth", AuthRouter);
AppRouter.use("/api/v1/ads", ListingsRouter);
AppRouter.use("/api/v1/users", UsersRouter);
AppRouter.use("/api/v1/payments", PaymentsRouter);
AppRouter.use("/api/v1/orders", OrdersRouter);

AppRouter.get("/health", (req, res) => {
  res.send("OK");
});
