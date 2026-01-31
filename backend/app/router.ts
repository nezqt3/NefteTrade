import { app as AppRouter } from "./app";
import AuthRouter from "../modules/auth/auth.routes";
import ListingsRouter from "../modules/listings/listings.routes";

AppRouter.use("/api/v1/auth/", AuthRouter);
AppRouter.use("/api/v1/announcements/", ListingsRouter);
AppRouter.get("/health", (req, res) => {
  res.send("OK");
});
