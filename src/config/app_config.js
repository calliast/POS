require("dotenv").config({ path: ".env" });

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  },
  server: { PORT },
};

module.exports = config;
