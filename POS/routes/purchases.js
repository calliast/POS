var express = require("express");
var router = express.Router();
const moment = require("moment");
const { isLoggedIn } = require("../public/javascripts/util");

module.exports = function (db) {
  let runNum = 1;
  let fromPurchases = ``;

  // Go to main page
  router.route("/").get(isLoggedIn, async function (req, res) {
    try {
      res.render("./purchases/purchases", {
        user: req.session.user,
        info: req.flash(`info`),
      });
    } catch (error) {
      res.json(error);
    }
  });

  // Generate new invoice then redirect to add form
  router.route("/new").get(isLoggedIn, async function (req, res) {
    try {
      const { userid } = req.session.user;
      console.log(userid);
      fromPurchases = `INSERT INTO purchases (totalsum, operator) VALUES(0, $1) returning *`;
      const getInvoice = await db.query(fromPurchases, [userid]);
      res.redirect(`/purchases/id/${getInvoice.rows[0].invoice}`);
    } catch (error) {
      res.json(error);
    }
  });

  router
    .route("/new/:invoice")
    // Read table invoice
    .get(isLoggedIn, async function (req, res) {
      try {
        const whereInvoice = req.params.invoice;
        let params = [];

        const sortBy = req.query.columns[req.query.order[0].column].data;
        const sortMode = req.query.order[0].dir;

        console.log({ queryUnits: req.query });

        fromInvoiceJoin = `SELECT purchaseitems.id, purchaseitems.invoice, purchaseitems.itemcode, goods.name, purchaseitems.quantity, purchaseitems.purchaseprice, purchaseitems.totalprice FROM purchaseitems LEFT OUTER JOIN goods ON purchaseitems.itemcode = goods.barcode WHERE invoice = $1`;

        const data = await db.query(fromInvoiceJoin, [whereInvoice]);

        const response = {
          draw: Number(req.query.draw),
          data: data.rows,
          info: req.flash(`info`),
        };

        runNum++;
        res.json(response);
      } catch (error) {
        res.json(error);
      }
    })
    // Update the supplier in a purchase
    .post(isLoggedIn, async function (req, res) {
      try {
        console.log(`masuk put nih`);
        const whereInvoice = req.params.invoice;
        let fromPurchases = `UPDATE purchases SET "supplier" = $1 WHERE "invoice" = $2`;
        console.log("ini invoice", whereInvoice);
        if (req.body.suppliers) {
          console.log("ini suppliers", req.body.suppliers);
          const updatedPurchases = await db.query(fromPurchases, [
            req.body.suppliers,
            whereInvoice,
          ]);
          return res.redirect("/purchases");
        } else {
          console.log("suppliernya gada");
          return res.redirect("/purchases");
        }
      } catch (error) {
        res.json(error);
      }
    });

  // Read data purchases
  router.route("/id").get(isLoggedIn, async function (req, res) {
    try {
      let params = [];

      if (req.query.search.value) {
        params.push(`invoice ILIKE '%${req.query.search.value}%'`);
      }

      const limit = req.query.length;
      const offset = req.query.start;
      const sortBy = req.query.columns[req.query.order[0].column].data;
      const sortMode = req.query.order[0].dir;

      let queryTotal = `SELECT count(*) as TOTAL FROM purchases${
        params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
      }`;
      let queryData = `SELECT * FROM purchases LEFT OUTER JOIN suppliers ON purchases.supplier = suppliers.supplierid ${
        params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
      } ORDER BY ${sortBy} ${sortMode} LIMIT ${limit} OFFSET ${offset}`;

      const total = await db.query(queryTotal);
      const data = await db.query(queryData);

      const response = {
        draw: Number(req.query.draw),
        recordsTotal: total.rows[0].total,
        recordsFiltered: total.rows[0].total,
        data: data.rows,
        info: req.flash(`info`),
      };

      runNum++;
      res.json(response);
    } catch (error) {
      res.json(error);
    }
  });

  // Redirect to add form
  router
    .route("/id/:invoice")
    .get(isLoggedIn, async function (req, res) {
      try {
        const { invoice } = req.params;

        let fromPurchases = `SELECT * FROM purchases LEFT OUTER JOIN users ON purchases.operator = users.userid WHERE "invoice" = $1`;
        let fromGoods = `SELECT * FROM goods`;
        let fromSupplier = `SELECT * FROM suppliers`;

        const getPurchases = await db.query(fromPurchases, [invoice]);
        const getGoods = await db.query(fromGoods);
        const getSupplier = await db.query(fromSupplier);
        res.render("./purchases/edit", {
          user: req.session.user,
          invoice: getPurchases.rows[0],
          goods: getGoods.rows,
          supplier: getSupplier.rows,
          info: req.flash(`info`),
          setDate: moment,
        });
      } catch (error) {
        res.json(error);
      }
    })
    // Update totalsum of purchases
    .post(isLoggedIn, async function (req, res) {
      try {
        let fromPurchases = `SELECT * FROM purchases WHERE "invoice" = $1`;
        const whereInvoice = req.params.invoice;
        const getPurchases = await db.query(fromPurchases, [whereInvoice]);
        res.json(getPurchases.rows[0]);
      } catch (error) {
        res.json(error);
      }
    })
    // Remove an invoice from purchases list
    .delete(isLoggedIn, async function (req, res) {
      try {
        let fromPurchases = `DELETE FROM purchases WHERE "invoice" = $1`;
        const whereInvoice = req.params.invoice;
        const removeInvoice = await db.query(fromPurchases, [whereInvoice]);
        console.log(`masuk delete`, removeInvoice);
        res.json(getPurchases.rows[0]);
      } catch (error) {
        res.json(error);
      }
    });

  // Read data invoice
  router
    .route("/invoice")
    .get(isLoggedIn, async function (req, res) {
      try {
        let params = [];

        const sortBy = req.query.columns[req.query.order[0].column].data;
        const sortMode = req.query.order[0].dir;

        console.log({ queryUnits: req.query });

        fromPurchases = `SELECT purchaseitems.id, purchaseitems.invoice, purchaseitems.itemcode, goods.name, purchaseitems.quantity, purchaseitems.purchaseprice, purchaseitems.totalprice FROM purchaseitems LEFT OUTER JOIN goods ON purchaseitems.itemcode = goods.barcode;`;

        const data = await db.query(fromPurchases);

        const response = {
          draw: Number(req.query.draw),
          data: data.rows,
          info: req.flash(`info`),
        };

        runNum++;
        res.json(response);
      } catch (error) {
        res.json(error);
      }
    })
    // Add a new item into invoice list
    .post(isLoggedIn, async function (req, res) {
      try {
        const { invoice, itemcode, quantity } = req.body;

        let intoInvoice = `INSERT INTO purchaseitems("invoice", "itemcode", "quantity") VALUES ($1, $2, $3) returning *`;

        const addItem = await db.query(intoInvoice, [
          invoice,
          itemcode,
          parseInt(quantity),
        ]);

        res.json(getPurchases.rows[0]);
      } catch (error) {
        res.json(error);
      }
    });

  // Remove an item from an invoice
  router
    .route("/invoice/:id")
    .delete(isLoggedIn, async function (req, res) {
      try {
        fromInvoice = `DELETE FROM purchaseitems WHERE "id" = $1 returning *`;
        const whereId = req.params.id;
        const deleteItem = await db.query(fromInvoice, [parseInt(whereId)]);
        res.json(deleteItem);
      } catch (error) {
        res.json(error);
      }
    });

  // Get item from goods
  router
  .route('/get-goods/:barcode')
  .post(isLoggedIn, async function (req, res) {
    try {
      const { barcode } = req.params;
      let fromGoods = `SELECT * FROM goods WHERE barcode = $1`;
      const getList = await db.query(fromGoods, [barcode]);
      res.json(getList.rows[0]);
    } catch (error) {
      res.json(error);
    }
  })

  runNum++;

  return router;
};
