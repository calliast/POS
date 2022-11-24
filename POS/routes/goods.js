var express = require("express");
var router = express.Router();
const { isLoggedIn, currencyFormatter } = require("../public/javascripts/util");

module.exports = function (db) {
  let runNum = 1;
  let sql = ``;

  /* GOODS Route. */
  router.route("/").get(isLoggedIn, async function (req, res) {
    try {
        const getUnit = await db.query(`SELECT unit from units`)

        console.log(getUnit);
      res.render("./goods/goods", {
        user: req.session.user,
        unit: getUnit.rows,
        info: req.flash(`info`),
      });
    } catch (error) {
      res.json(error);
    }
  });

  /* ALL CRUD */
  router
    .route("/data")
    // 1. GET METHOD - Read all users
    .get(isLoggedIn, async function (req, res) {
      try {
        let params = [];

        if (req.query.search.value) {
          params.push(`barcode LIKE '%${req.query.search.value}%'`);
          params.push(`name ILIKE '%${req.query.search.value}%'`);
        }

        const limit = req.query.length;
        const offset = req.query.start;
        const sortBy = req.query.columns[req.query.order[0].column].data;
        const sortMode = req.query.order[0].dir;

        console.log({ queryGoods: req.query });

        let queryTotal = `SELECT count(*) as TOTAL FROM goods${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        }`;
        let queryData = `SELECT * FROM goods${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        } ORDER BY ${sortBy} ${sortMode} LIMIT ${limit} OFFSET ${offset}`;

        console.log({
          sqlQuery: {
            queryTotal,
            queryData,
          },
        });

        const total = await db.query(queryTotal);
        const data = await db.query(queryData);

        console.log({
          "Percobaan ke": runNum,
          limit,
          offset,
          sortBy,
          sortMode,
          hasil: total.rows,
          data: data.rows,
        });

        const response = {
          draw: Number(req.query.draw),
          recordsTotal: total.rows[0].total,
          recordsFiltered: total.rows[0].total,
          data: data.rows,
          currencyFormatter,
        };

        runNum++;
        res.json(response);
      } catch (error) {
        res.json(error);
      }
    })
    // 2. POST METHOD - Add a new unit
    .post(isLoggedIn, async function (req, res) {
      try {
        sql = `SELECT * FROM units WHERE barcode = $1`;
        const {
          barcode,
          name,
          stock,
          purchasePrice,
          sellingPrice,
          unit,
          picture,
          checkTag,
        } = req.body;

        // Check if unit already exist
        const barcodeCheck = await db.query(sql, [barcode]);

        if (checkTag) {
          if (emailCheck.rowCount) {
            return res.json({
              data: null,
            });
          } else {
            return res.json({
              data: emailCheck.rows,
            });
          }
        }

        sql = `INSERT INTO units("unit", "name", "note") VALUES ($1, $2, $3)`;

        const insertData = await db.query(sql, [unit, name, note]);

        res.json(insertData);
      } catch (error) {
        res.json(error);
      }
    });

  router
    .route("/data/:unit")
    // GET METHOD - Pull user's data to the edit page
    .get(isLoggedIn, async function (req, res) {
      try {
        sql = `SELECT * FROM units WHERE "unit" = $1`;
        const unit = req.params.unit;
        const getData = await db.query(sql, [unit]);
        res.json(getData);
      } catch (error) {
        res.json(error);
      }
    })
    // PUT METHOD - Update edited user data
    .put(isLoggedIn, async function (req, res) {
      try {
        const response = [
          req.params.unit,
          req.body.name,
          req.body.note,
          req.params.unit,
        ];

        sql = `UPDATE units SET "unit" = $1, "name" = $2, "note" = $3 WHERE "unit" = $4`;
        const getData = await db.query(sql, response);

        res.json(getData);
      } catch (error) {
        res.json(error);
      }
    })
    // 3. DELETE METHOD - Delete a user and its data
    .delete(isLoggedIn, async function (req, res) {
      try {
        sql = `DELETE FROM units WHERE "unit" = $1`;
        const unit = req.params.unit;
        const deleteData = await db.query(sql, [unit]);
        res.json(deleteData);
      } catch (error) {
        res.json(error);
      }
    });

  runNum++;

  return router;
};
