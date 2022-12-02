var express = require("express");
var router = express.Router();
const path = require("path");
const { isLoggedIn } = require("../public/javascripts/util");

module.exports = function (db) {
  let runNum = 1;
  let sql;
  let response;

  /* Goods page Route. */
  router.route("/").get(isLoggedIn, async function (req, res) {
    try {
      const getUnit = await db.query(`SELECT * from units`);

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

  /* Add goods Route. */
  router
    .route("/add")
    .get(isLoggedIn, async function (req, res) {
      try {
        const getUnit = await db.query(`SELECT * from units`);

        res.render("./goods/add", {
          user: req.session.user,
          unit: getUnit.rows,
        });
      } catch (error) {
        res.json(error);
      }
    })
    .post(isLoggedIn, async function (req, res) {
      try {
        const { barcode, name, stock, purchasePrice, sellingPrice, unit } =
          req.body;

        /* Driver Code for picture upload */
        // The name of the input field (i.e. "picture") is used to retrieve the uploaded file
        let picture = req.files.picture;
        let pictureName = `${Date.now()}-${picture.name}`;

        if (!req.files || Object.keys(req.files).length === 0) {
          pictureName = `No picture`;
        }

        let uploadPath = path.join(
          __dirname,
          "..",
          "public",
          "images",
          "goods",
          pictureName
        );

        // /* Driver code to add data */
        sql = `INSERT INTO goods("barcode", "name", "stock", "unit", "purchaseprice", "sellingprice", "picture") VALUES($1,$2,$3,$4,$5,$6,$7)`;

        const response = [
          barcode,
          name,
          stock,
          unit,
          purchasePrice,
          sellingPrice,
          pictureName,
        ];

        console.log({ response });

        await db.query(sql, response);
        await picture.mv(uploadPath);

        res.redirect("/goods");
      } catch (error) {
        res.json(error);
      }
    });

  /* Edit a goods Route. */
  router
    .route("/edit/:barcode")
    .get(isLoggedIn, async function (req, res) {
      try {
        sql = `SELECT * FROM goods WHERE "barcode" = $1`;

        const { barcode } = req.params;

        console.log(barcode);
        console.log(sql);
        const selectData = await db.query(sql, [barcode]);
        const getUnit = await db.query(`SELECT * from units`);

        console.log({
          selectData,
          getUnit,
        });

        res.render("./goods/edit", {
          user: req.session.user,
          data: selectData.rows,
          unit: getUnit.rows,
        });
      } catch (error) {
        res.json(error);
      }
    })
    .post(isLoggedIn, async function (req, res) {
      try {
        let picture;
        let pictureName;

        const { barcode, name, stock, purchasePrice, sellingPrice, unit } =
          req.body;

        if (!req.files || Object.keys(req.files).length === 0) {
          // /* Driver code to update data */
          sql = `UPDATE goods SET "barcode" = $1, "name" = $2, "stock" = $3, "purchaseprice" = $4, "sellingprice" = $5, "unit" = $6 WHERE "barcode" = $7`;

          response = [
            barcode,
            name,
            stock,
            purchasePrice,
            sellingPrice,
            unit,
            barcode,
          ];

          await db.query(sql, response);

          return res.redirect("/goods");
        }

        /* Driver Code for picture upload */
        // The name of the input field (i.e. "picture") is used to retrieve the uploaded file
        picture = req.files.picture;
        pictureName = `${Date.now()}-${picture.name}`;

        let uploadPath = path.join(
          __dirname,
          "..",
          "public",
          "images",
          "goods",
          pictureName
        );

        response = [
          barcode,
          name,
          stock,
          purchasePrice,
          sellingPrice,
          unit,
          pictureName,
          barcode,
        ];

        // /* Driver code to update data */
        sql = `UPDATE goods SET "barcode" = $1, "name" = $2, "stock" = $3, "purchaseprice" = $4, "sellingprice" = $5, "unit" = $6, "picture" = $7 WHERE "barcode" = $8`;

        await db.query(sql, response);
        await picture.mv(uploadPath);

        res.redirect("/goods");
      } catch (error) {
        res.json(error);
      }
    });

  // API - Read all goods - GET METHOD
  router.route("/data").get(isLoggedIn, async function (req, res) {
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
      };

      runNum++;
      res.json(response);
    } catch (error) {
      res.json(error);
    }
  });

  // Check if barcode already used - POST METHOD
  router.route("/data/check").post(isLoggedIn, async function (req, res) {
    try {
      sql = `SELECT * FROM goods WHERE barcode = $1`;
      const { barcode } = req.body;

      const barcodeCheck = await db.query(sql, [barcode]);

      if (barcodeCheck.rowCount) {
        return res.json({
          data: null,
        });
      }

      res.json({
        data: barcodeCheck.rows,
      });
    } catch (error) {
      res.json;
    }
  });

  // 5. Delete a goods and its data - DELETE METHOD
  router.route("/data/:barcode").delete(isLoggedIn, async function (req, res) {
    try {
      sql = `DELETE FROM goods WHERE "barcode" = $1`;
      const barcode = req.params.barcode;
      console.log("ini route delete", sql, barcode);
      const deleteData = await db.query(sql, [barcode]);
      res.json(deleteData);
    } catch (error) {
      res.json(error);
    }
  });

  runNum++;

  return router;
};
