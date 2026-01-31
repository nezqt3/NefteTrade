import { app as AppRouter } from "./app";
import AuthRouter from "../modules/auth/auth.routes";
import ListingsRouter from "../modules/listings/listings.routes";
import UsersRouter from "../modules/users/users.routes";

AppRouter.use("/api/v1/auth", AuthRouter);
AppRouter.use("/api/v1/ads", ListingsRouter);
AppRouter.use("/api/v1/users", UsersRouter);

AppRouter.get("/health", (req, res) => {
  res.send("OK");
});
