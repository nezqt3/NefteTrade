import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "NefteTrade API",
      version: "1.0.0",
      description: "API документация для проекта NefteTrade",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  security: [{ bearerAuth: [] }],
  apis: [
    "./src/modules/auth/*.ts",
    "./src/modules/listings/*.ts",
    "./src/modules/users/*.ts",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
