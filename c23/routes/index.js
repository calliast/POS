var express = require("express");
var router = express.Router();

module.exports = function (db) {
  /* GET home page. */
  router
  .route("/")
  .get(async function (req, res) {
    try {
      // let sql = `SELECT "userid", "email", "name", "password", "role" FROM users ORDER BY "userid" ASC`;
      let sql = `SELECT * FROM users`;
      const readData = await db.query(sql);
      // const readData = `test`
      res.render("index", { 
        title: "Express", 
        data: readData.rows
      });
    } catch (error) {
      res.send('error')
    }
  });

  return router;
};
