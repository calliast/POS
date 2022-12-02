var express = require("express");
var router = express.Router();
const path = require("path");
const { isLoggedIn } = require("../public/javascripts/util");

module.exports = function (db) {
  let runNum = 1;
  let sql = ``;

  // Route to customers page
  router.route("/").get(isLoggedIn, async function (req, res) {
    try {
      res.render("./customers/customers", {
        user: req.session.user,
        info: req.flash(`info`),
      });
    } catch (error) {
      res.json(error);
    }
  });

  // Add Page
  router.route("/add").get(isLoggedIn, async function (req, res) {
    try {
      res.render("./customers/add", {
        user: req.session.user,
      });
    } catch (error) {
      res.json(error);
    }
  // Adding customer method
  }).post(isLoggedIn, async function (req, res) {
    try {
      const {
        name,
        address,
        phone
      } = req.body

      sql = `INSERT INTO customers("name", "address", "phone") VALUES($1,$2,$3)`

      const response = [
        name,
        address,
        phone
      ];

      await db.query(sql, response)

      res.redirect('/customers')
    } catch (error) {
      res.json(error)
    }
  })

  // Edit page
  router
    .route("/edit/:customerid")
    .get(isLoggedIn, async function (req, res) {
      try {
        sql = `SELECT * FROM customers WHERE "customerid" = $1`;

        const { customerid } = req.params;

        const selectData = await db.query(sql, [customerid]);

        res.render("./customers/edit", {
          user: req.session.user,
          data: selectData.rows,
        });
      } catch (error) {
        res.json(error);
      }
    })
    // Save updated page
    .post(isLoggedIn, async function (req, res) {
      try {
        sql = `UPDATE customers SET "name" = $1, "address" = $2, "phone" = $3 WHERE "customerid" = $4`;

        const { name, address, phone } = req.body;

        const response = [
          name, address.trim(), phone, req.params.customerid
        ];

        console.log({response});
        await db.query(sql, response)

        res.redirect('/customers')
      } catch (error) {
        res.json(error);
      }
    });

  // API - Read all customers
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

        let queryTotal = `SELECT count(*) as TOTAL FROM customers${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        }`;
        let queryData = `SELECT * FROM customers${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        } ORDER BY ${sortBy} ${sortMode} LIMIT ${limit} OFFSET ${offset}`;

        const total = await db.query(queryTotal);
        const data = await db.query(queryData);

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

  // 5. Delete a customer and its data
  router
    .route("/data/:customerid")
    .delete(isLoggedIn, async function (req, res) {
      try {
        sql = `DELETE FROM customers WHERE "customerid" = $1`;
        const customerid = req.params.customerid;
        console.log("ini route delete", sql, customerid);
        const deleteData = await db.query(sql, [customerid]);
        res.json(deleteData);
      } catch (error) {
        res.json(error);
      }
    });

  runNum++;

  return router;
};
