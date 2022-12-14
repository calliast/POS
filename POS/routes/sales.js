var express = require("express");
var router = express.Router();
const moment = require("moment");
const { isLoggedIn } = require("../helpers/util");

module.exports = function (db) {
  let fromSales = ``;

  router
    .route("/")
    // Render sales page
    .get(isLoggedIn, async function (req, res) {
      try {
        //. Return response
        res.render("./sales/sales", {
          user: req.session.user,
          info: req.flash(`info`),
          active: `sales`,
        });
      } catch (error) {
        res.json(error);
      }
    });

  router
    .route("/new")
    // Generate new invoice then redirect to add form
    .get(isLoggedIn, async function (req, res) {
      try {
        //. Request
        const { userid } = req.session.user;
        //. Add variable
        fromSales = `INSERT INTO sales (totalsum, operator) VALUES(0, $1) returning *`;
        //. Querying
        const getInvoice = await db.query(fromSales, [userid]);
        //. Return response
        res.redirect(`/sales/id/${getInvoice.rows[0].invoice}`);
      } catch (error) {
        res.json(error);
      }
    });

  router
    .route("/new/:invoice")
    // Populate invoice table
    .get(isLoggedIn, async function (req, res) {
      try {
        //. Request
        const whereInvoice = req.params.invoice;
        const sortBy = req.query.columns[req.query.order[0].column].data;
        const sortMode = req.query.order[0].dir;
        //. Add variable
        let params = [];
        let fromThisInvoice = `SELECT saleitems.id, saleitems.invoice, saleitems.itemcode, goods.name, saleitems.quantity, saleitems.sellingprice, saleitems.totalprice FROM saleitems LEFT OUTER JOIN goods ON saleitems.itemcode = goods.barcode WHERE invoice = $1`;
        //. Querying
        const getData = await db.query(fromThisInvoice, [whereInvoice]);
        const response = {
          draw: Number(req.query.draw),
          data: getData.rows,
          info: req.flash(`info`),
        };
        //. Return response
        res.json(response);
      } catch (error) {
        res.json(error);
      }
    })
    // Save payment and customer in a transaction
    .post(isLoggedIn, async function (req, res) {
      try {
        //. Request
        const whereInvoice = req.params.invoice;
        const { pay = 0, change = 0, customer = 1 } = req.body;

        //. Add variable
        fromSales = `UPDATE sales SET "pay" = $1, "change" = $2, "customer" = $3 WHERE "invoice" = $4`;
        //. Return response 1
        await db.query(fromSales, [pay, change, customer, whereInvoice]);
        res.redirect("/sales");
      } catch (error) {
        res.json(error);
      }
    });

  router
    .route("/id")
    // Read sales table
    .get(isLoggedIn, async function (req, res) {
      try {
        //. Request
        let params = [];
        if (req.query.search.value) {
          params.push(`invoice ILIKE '%${req.query.search.value}%'`);
        }
        const limit = req.query.length;
        const offset = req.query.start;
        const sortBy = req.query.columns[req.query.order[0].column].data;
        const sortMode = req.query.order[0].dir;
        //. Add variable
        let queryTotal = `SELECT count(*) as TOTAL FROM sales${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        }`;
        let queryData = `SELECT * FROM sales LEFT OUTER JOIN customers ON sales.customer = customers.customerid${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        } ORDER BY ${sortBy} ${sortMode} LIMIT ${limit} OFFSET ${offset}`;
        //. Querying
        const total = await db.query(queryTotal);
        const data = await db.query(queryData);
        const response = {
          draw: Number(req.query.draw),
          recordsTotal: total.rows[0].total,
          recordsFiltered: total.rows[0].total,
          data: data.rows,
          info: req.flash(`info`),
        };
        //. Return response
        res.json(response);
      } catch (error) {
        res.json(error);
      }
    });

  router
    .route("/id/:invoice")
    // Redirect to add form
    .get(isLoggedIn, async function (req, res) {
      try {
        //. Request
        const { invoice } = req.params;
        //. Add variable
        fromSales = `SELECT * FROM sales LEFT OUTER JOIN users ON sales.operator = users.userid WHERE "invoice" = $1`;
        let fromGoods = `SELECT * FROM goods`;
        let fromCustomers = `SELECT * FROM customers`;
        //. Querying
        const getSales = await db.query(fromSales, [invoice]);
        const getGoods = await db.query(fromGoods);
        const getCustomers = await db.query(fromCustomers);
        //. Return response
        res.render("./sales/edit", {
          user: req.session.user,
          invoice: getSales.rows[0],
          goods: getGoods.rows,
          customer: getCustomers.rows,
          info: req.flash(`info`),
          setDate: moment,
          active: `sales/edit`,
        });
      } catch (error) {
        res.json(error);
      }
    })
    // Get totalsum of sales
    .post(isLoggedIn, async function (req, res) {
      try {
        //. Request
        const whereInvoice = req.params.invoice;
        //. Add variable
        fromSales = `SELECT * FROM sales WHERE "invoice" = $1`;
        //. Querying
        const getSales = await db.query(fromSales, [whereInvoice]);
        res.json(getSales.rows[0]);
      } catch (error) {
        res.json(error);
      }
    })
    // Remove an invoice from sales list
    .delete(isLoggedIn, async function (req, res) {
      try {
        //. Request
        const whereInvoice = req.params.invoice;
        //. Add variable
        fromSales = `DELETE FROM sales WHERE "invoice" = $1 returning *`;
        //. Querying
        const removeInvoice = await db.query(fromSales, [whereInvoice]);
        //. Return response
        res.json(removeInvoice.rows);
      } catch (error) {
        res.json(error);
      }
    });

  router
    .route("/invoice")
    // Add a new item into invoice list
    .post(isLoggedIn, async function (req, res) {
      try {
        //. Request
        const { invoice, itemcode, quantity } = req.body;
        //. Add variable
        let intoInvoice = `INSERT INTO saleitems("invoice", "itemcode", "quantity") VALUES ($1, $2, $3) returning *`;
        //. Querying
        const addItem = await db.query(intoInvoice, [
          invoice,
          itemcode,
          parseInt(quantity),
        ]);
        //. Returning response
        res.json(getPurchases.rows[0]);
      } catch (error) {
        res.json(error);
      }
    });

  router
    .route("/invoice/:id")
    // Remove an item from an invoice
    .delete(isLoggedIn, async function (req, res) {
      try {
        //. Request
        const whereId = req.params.id;
        //. Add variable
        fromInvoice = `DELETE FROM saleitems WHERE "id" = $1 returning *`;
        //. Querying
        const deleteItem = await db.query(fromInvoice, [parseInt(whereId)]);
        //. Returning response
        res.json(deleteItem);
      } catch (error) {
        res.json(error);
      }
    });

  router
    .route("/get-goods/:barcode")
    // Get item from goods
    .post(isLoggedIn, async function (req, res) {
      try {
        //. Request
        const { barcode } = req.params;
        //. Add variable
        let fromGoods = `SELECT * FROM goods WHERE barcode = $1`;
        //. Querying
        const getList = await db.query(fromGoods, [barcode]);
        //. Returning response
        res.json(getList.rows[0]);
      } catch (error) {
        res.json(error);
      }
    });

  return router;
};
