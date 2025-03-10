import * as controllers from '../Modules/index.js';
import { createHandler } from 'graphql-http/lib/use/express';
import { globalErrorHandlerMiddleware } from '../Middleware/error-handler.middleware.js';
import { mainSchema } from '../GraphQl/main.schema.js';
import { rateLimit } from 'express-rate-limit'


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    legacyHeaders: false
})

const controllerHandler = (app, express) => {

    // ✅ GraphQL Routes
    app.use('/dashboard/graphql', createHandler({ schema: mainSchema, graphiql: true }));

    // ✅ Assets Routes
    app.use('/Assets', express.static('Assets'));

    // ✅ Authentication Routes
    app.use("/auth", controllers.authController);

    // ✅ User Routes
    app.use("/user", controllers.userController);

    // ✅ Company Routes
    app.use("/company", controllers.companyController);

    // ✅ Job Routes
    app.use("/jobs", controllers.jobsController);

    // ✅ Admin Routes
    app.use("/admin", controllers.adminController);

    // ✅ Message Routes
    app.use("/message", controllers.messageController);

    // ✅ Rate Limiting
    app.use(limiter);

    // ✅ Main Routes
    app.get("/", (req, res) => res.send("Hello from the Job Search App!"));

    // ✅ Not Found Routes
    app.all("*", (req, res) => res.status(404).json({ message: "Route not found" }));

    // ✅ Error Handler Middleware
    app.use(globalErrorHandlerMiddleware)
}

export default controllerHandler;