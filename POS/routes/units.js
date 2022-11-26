var express = require("express");
const { isLoggedIn } = require("../public/javascripts/util");
var router = express.Router();
const helpers = require("../public/javascripts/util");

module.exports = function (db) {
  let runNum = 1;
  let sql = ``;
  
  /* UNITS Route. */
  router
  .route("/")
  .get(helpers.isLoggedIn, async function (req, res) {
    try {
      res.render("./units/units", { 
        user: req.session.user,
        info: req.flash(`info`)  
      });
    } catch (error) {
      res.json(error);
    }
  })

  /* ALL CRUD */
  router
    .route("/data")
    // 1. GET METHOD - Read all units
    .get(helpers.isLoggedIn, async function (req, res) {
      try {
        let params = [];

        if (req.query.search.value) {
          params.push(`unit ILIKE '%${req.query.search.value}%'`);
          params.push(`name ILIKE '%${req.query.search.value}%'`);
          params.push(`note ILIKE '%${req.query.search.value}%'`);
        }

        const limit = req.query.length;
        const offset = req.query.start;
        const sortBy = req.query.columns[req.query.order[0].column].data;
        const sortMode = req.query.order[0].dir;

        console.log({ queryUnits: req.query });

        let queryTotal = `SELECT count(*) as TOTAL FROM units${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        }`;
        let queryData = `SELECT * FROM units${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        } ORDER BY ${sortBy} ${sortMode} LIMIT ${limit} OFFSET ${offset}`;

        console.log({
          sqlQuery: {
            queryTotal,
            queryData
          }
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
          info: req.flash(`info`),
        };

        runNum++;
        res.json(response);
      } catch (error) {
        res.json(error);
      }
    })
    // 2. POST METHOD - Add a new unit
    .post(helpers.isLoggedIn, async function (req, res) {
      try {
        const { unitNew, name, note } = req.body;

        // Save data
        sql = `INSERT INTO units("unit", "name", "note") VALUES ($1, $2, $3)`;

        const insertData = await db.query(sql, [
          unitNew,
          name,
          note
        ]);

        res.json(insertData);
      } catch (error) {
        res.json(error);
      }
    });

    // Check if unit already exist
    router.route('/data/check').post(isLoggedIn, async function(req,res) {
      try {
        sql = `SELECT * FROM units WHERE unit = $1`;
        const { unit } = req.body;

        const unitCheck = await db.query(sql, [unit]);
        
        if (unitCheck.rowCount) {
          return res.json({
            data: null,
          })
        }

        res.json({
          data: unitCheck.rows,
        })
        
      } catch (error) {
        res.json
      }
    })

    router
    .route("/data/:unit")
    // GET METHOD - Pull user's data to the edit page
    .get(helpers.isLoggedIn, async function (req, res) {
      try {
        sql = `SELECT * FROM units WHERE "unit" = $1`;
        const unit = req.params.unit
        const getData = await db.query(sql, [unit]);
        res.json(getData);
      } catch (error) {
        res.json(error);
      }
    })
    // PUT METHOD - Update edited user data
    .put(helpers.isLoggedIn, async function (req, res) {
      try {
        const { unitUpd, name, note } = req.body
        console.log(`masuk route update`);
        const response = [
          unitUpd,
          name,
          note,
          req.params.unit,
        ];

        console.log(response);
        
        sql =
        `UPDATE units SET "unit" = $1, "name" = $2, "note" = $3 WHERE "unit" = $4`;
        const getData = await db.query(sql, response);

        console.log('hasil update', getData);
        
        res.json(getData);
      } catch (error) {
        res.json(error);
      }
    })
    // 3. DELETE METHOD - Delete a user and its data
    .delete(helpers.isLoggedIn, async function (req, res) {
      try {
        sql = `DELETE FROM units WHERE "unit" = $1`;
        const unit = req.params.unit
        const deleteData = await db.query(sql, [unit]);
        res.json(deleteData);
      } catch (error) {
        res.json(error);
      }
    });

  runNum++

  return router;
};
