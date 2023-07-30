import dotenv from "dotenv";

dotenv.config({ path: `/.env` });

// console.log(dotenv)

const env = process.env;
console.log(`🚀 ~ file: config.js:6 ~ env::\n`, env);

const PORT = process.env.URL_PORT ? Number(process.env.URL_PORT) : 8080;

const config = {
  pg: {
    user: process.env.DB_PG_USERNAME,
    host: process.env.DB_PG_HOST,
    database: process.env.DB_PG_NAME,
    password: process.env.DB_PG_PASSWORD,
    port: process.env.DB_PG_PORT,
  },
  session: {
    secret: process.env.AUTH_SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  },
  PORT,
};

export default config;
