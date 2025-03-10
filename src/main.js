import express from 'express';
import dotenv from 'dotenv'; // Load environment variables
dotenv.config();
import { database_connect } from './DB/connection.js';
import controllerHandler from './Utils/router-handler.utils.js';
import cors from 'cors';
import helmet from 'helmet'

// ✅ CORS Configuration
const whitelist = process.env.CORS_WHITELIST;
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

async function bootstrap() {
    
    // ✅ Initialize Express app
    const app = express();
    
    // ✅ Set default port and handle the listening process
    const port = process.env.PORT;
    
    app.use(express.json());
    
    // ✅ CORS Middleware
    app.use(cors(corsOptions));

    // ✅ Helmet
    app.use(helmet());

    // ✅ Load Controllers
    controllerHandler(app, express);

    // ✅ Await Database Connection
    await database_connect();

    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

}

export default bootstrap;
