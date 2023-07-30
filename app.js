import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import flash from "connect-flash";
import fileUpload from "express-fileupload";
import cors from "cors";
import debug from "debug";
import http from "http";
import util from "./src/helpers/util.js";
import config from "./src/config/config.js";

import indexRouter from "./src/routes/index.js";
import usersRouter from "./src/routes/users.js";
import unitsRouter from "./src/routes/units.js";
import goodsRouter from "./src/routes/goods.js";
import suppliersRouter from "./src/routes/suppliers.js";
import purchasesRouter from "./src/routes/purchases.js";
import customersRouter from "./src/routes/customers.js";
import salesRouter from "./src/routes/sales.js";
import dashboardRouter from "./src/routes/dashboard.js";
import profileRouter from "./src/routes/profile.js";
import pg from "pg";

const __dirname = path.resolve(path.dirname(""));
const { Pool } = pg;

async function main() {
  try {
    const pool = new Pool({
      user: "ikhsan",
      host: "localhost",
      database: "posdb",
      password: "1234",
      port: 5432,
    });

    console.log(`Successfully connected to pgAdmin4`);

    return pool;
  } catch (error) {
    throw error;
  }
}

main()
  .then((db) => {
    var app = express();

    // view engine setup
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));
    app.use(fileUpload());
    app.use(
      session({
        secret: "rubicamp",
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true }
      })
    );
    app.use(cors());
    app.use(flash());

    app.use("/", indexRouter(db));
    app.use("/users", usersRouter(db));
    app.use("/units", unitsRouter(db));
    app.use("/goods", goodsRouter(db));
    app.use("/suppliers", suppliersRouter(db));
    app.use("/purchases", purchasesRouter(db));
    app.use("/customers", customersRouter(db));
    app.use("/sales", salesRouter(db));
    app.use("/dashboard", dashboardRouter(db));
    app.use("/profile", profileRouter(db));

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });

    /**
     * Get port from environment and store in Express.
     */

    var port = normalizePort(process.env.PORT || "3023");
    app.set("port", port);

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
      var port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
      if (error.syscall !== "listen") {
        throw error;
      }

      var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case "EACCES":
          console.error(bind + " requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(bind + " is already in use");
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
      var addr = server.address();
      var bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
      debug("Listening on " + bind);
    }

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  })
  .catch((err) => {
    console.log("gagal bro", err);
  });
