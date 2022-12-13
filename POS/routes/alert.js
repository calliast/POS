var express = require("express");
var router = express.Router();
const { isAdmin } = require("../helpers/util");

module.exports = function (db) {
  
  router.get("/", isAdmin, async function (req, res) {
    try {
        sql = `SELECT barcode, name, stock FROM goods where stock <= 5`;

        const { rows: getAlertData } = await db.query(sql);

        res.json({
          data: getAlertData
        })
      } catch (error) {
        res.json(error);
      }
  })

  return router;
};
