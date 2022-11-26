var express = require("express");
var router = express.Router();
const path = require("path");
const { isLoggedIn } = require("../public/javascripts/util");

module.exports = function (db) {
  let runNum = 1;
  let sql = ``;

  /* Suppliers page route */
  router.route("/").get(isLoggedIn, async function (req, res) {
    try {
      res.render("./suppliers/suppliers", {
        user: req.session.user,
        info: req.flash(`info`),
      });
    } catch (error) {
      res.json(error);
    }
  });

  /* Add goods route */
  // Add Page
  router.route("/add").get(isLoggedIn, async function (req, res) {
    try {
      res.render("./suppliers/add", {
        user: req.session.user,
      });
    } catch (error) {
      res.json(error);
    }
  // Adding data
  }).post(isLoggedIn, async function (req, res) {
    try {
      const {
        name,
        address,
        phone
      } = req.body

      // /* Driver code to add data */
      sql = `INSERT INTO suppliers("name", "address", "phone") VALUES($1,$2,$3)`

      const response = [
        name,
        address,
        phone
      ];

      console.log({response});

      await db.query(sql, response)

      res.redirect('/suppliers')
    } catch (error) {
      res.json(error)
    }
  })

  /* Edit a supplier route. */
  router
    .route("/edit/:supplierid")
    .get(isLoggedIn, async function (req, res) {
      try {
        sql = `SELECT * FROM suppliers WHERE "supplierid" = $1`;

        const { supplierid } = req.params;

        const selectData = await db.query(sql, [supplierid]);

        res.render("./suppliers/edit", {
          user: req.session.user,
          data: selectData.rows,
        });
      } catch (error) {
        res.json(error);
      }
    })
    .post(isLoggedIn, async function (req, res) {
      try {
        // /* Driver code to update data */
        sql = `UPDATE suppliers SET "name" = $1, "address" = $2, "phone" = $3 WHERE "supplierid" = $4`;

        const { name, address, phone } = req.body;

        const response = [
          name, address.trim(), phone, req.params.supplierid
        ];

        console.log({response});
        await db.query(sql, response)

        res.redirect('/suppliers')
      } catch (error) {
        res.json(error);
      }
    });

  // API - Read all suppliers - GET METHOD
  router
    .route("/data")
    .get(isLoggedIn, async function (req, res) {
      try {
        let params = [];

        if (req.query.search.value) {
          params.push(`name ILIKE '%${req.query.search.value}%'`);
          params.push(`address ILIKE '%${req.query.search.value}%'`);
          params.push(`phone ILIKE '%${req.query.search.value}%'`);
        }

        const limit = req.query.length;
        const offset = req.query.start;
        const sortBy = req.query.columns[req.query.order[0].column].data;
        const sortMode = req.query.order[0].dir;

        console.log({ queryGoods: req.query });

        let queryTotal = `SELECT count(*) as TOTAL FROM suppliers${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        }`;
        let queryData = `SELECT * FROM suppliers${
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
        };

        runNum++;
        res.json(response);
      } catch (error) {
        res.json(error);
      }
    })

  // 5. Delete a supplier and its data - DELETE METHOD
  router
    .route("/data/:supplierid")
    .delete(isLoggedIn, async function (req, res) {
      try {
        sql = `DELETE FROM suppliers WHERE "supplierid" = $1`;
        const supplierid = req.params.supplierid;
        console.log("ini route delete", sql, supplierid);
        const deleteData = await db.query(sql, [supplierid]);
        res.json(deleteData);
      } catch (error) {
        res.json(error);
      }
    });

  runNum++;

  return router;
};
