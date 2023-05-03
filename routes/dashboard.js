var express = require("express");
var router = express.Router();
const { isAdmin } = require("../helpers/util");

module.exports = function (db) {
  router.route("/").get(isAdmin, async function (req, res) {
    try {
      res.render("index", {
        user: req.session.user,
        active: `dashboard`,
      });
    } catch (error) {
      res.send("error");
    }
  });

  router
    .route("/report")
    // Monthly report
    .get(isAdmin, async function (req, res) {
      try {
        let queryData = `SELECT * FROM pos_monthly_report`;

        const { rows: getReport } = await db.query(queryData);

        res.json({
          data: getReport,
        });
      } catch (error) {
        res.json(error);
      }
    });

  router
    .route("/chart")
    // Line chart and doughnut chart
    .get(isAdmin, async function (req, res) {
      try {
        let params = [];
        const { startDate, endDate } = req.query;

        if (startDate && endDate) {
          params.push(
            `coalesce(to_char(purchases.time, 'YYYY-MM-DD'), to_char(sales.time, 'YYYY-MM-DD')) BETWEEN '${startDate}' AND '${endDate}'`
          );
        } else if (startDate && !endDate) {
          params.push(
            `coalesce(to_char(purchases.time, 'YYYY-MM-DD'), to_char(sales.time, 'YYYY-MM-DD')) >= '${startDate}'`
          );
        } else if (!startDate && endDate) {
          params.push(
            `coalesce(to_char(purchases.time, 'YYYY-MM-DD'), to_char(sales.time, 'YYYY-MM-DD')) <= '${endDate}'`
          );
        }

        let query_totalInvoices = `SELECT COUNT(*) AS totalinvoices FROM sales left join purchases on purchases.time = sales.time${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        }`;

        let query_totalPurchases = `select SUM(purchases.totalsum) as totalpurchases from purchases LEFT JOIN sales ON sales.time = purchases.time${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        }`;
        let query_totalSales = `select SUM(sales.totalsum) as totalsales from sales LEFT JOIN purchases ON purchases.time = sales.time${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        }`;
        console.log("🚀 ~ file: dashboard.js:63 ~ letquery_Statistics=`SELECTcoalesce ~ query_Statistics", query_totalPurchases)

        let query_Chart = `SELECT coalesce(sum(sales.totalsum), 0) - coalesce(sum(purchases.totalsum), 0) AS earnings, coalesce(to_char(purchases.time, 'Mon YY'), to_char(sales.time, 'Mon YY')) AS monthly FROM
        sales FULL OUTER JOIN purchases ON sales.time = purchases.time${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        } GROUP BY monthly ORDER BY to_date(coalesce(to_char(purchases.time, 'Mon YY'), to_char(sales.time, 'Mon YY')) || ' 01', 'Mon YY DD')`;

        let query_Customer = `select sum(case when sales.customer = 1 then 1 else 0 end) as direct, sum(case when sales.customer = 2 then 1 else 0 end) as customer from sales left join customers on customers.customerid = sales.customer left join purchases on purchases.time = sales.time${
          params.length > 0 ? ` WHERE ${params.join(" OR ")}` : ""
        }`;

        const { rows: chart } = await db.query(query_Chart);
        const { rows: customer } = await db.query(query_Customer);
        const { rows: totalInvoices } = await db.query(query_totalInvoices);
        const { rows: totalPurchases } = await db.query(query_totalPurchases);
        const { rows: totalSales } = await db.query(query_totalSales);
        console.log("🚀 ~ file: dashboard.js:78 ~ statistics", totalPurchases)

        res.json({
          line: chart,
          doughnut: customer,
          stats: {
            ...totalInvoices[0],
            ...totalSales[0],
            ...totalPurchases[0],
          },
        });
      } catch (error) {
        res.json(error);
      }
    });

  router
    .route("/table")
    // Monthly report
    .get(isAdmin, async function (req, res) {
      try {
        let params = [];
        let query = "";
        const { startDate, endDate } = req.query;

        if (startDate && endDate) {
          query = `to_date(monthly || ' 01', 'Mon YY DD') BETWEEN '${startDate}' AND '${endDate}'`;
        } else if (startDate && !endDate) {
          query = `to_date(monthly || ' 01', 'Mon YY DD') >= '${startDate}'`;
        } else if (!startDate && endDate) {
          query = `to_date(monthly || ' 01', 'Mon YY DD') <= '${endDate}'`;
        }

        if (req.query.search.value) {
          params.push(`monthly ILIKE '%${req.query.search.value}%'`);
          params.push(`expense::VARCHAR ILIKE '%${req.query.search.value}%'`);
          params.push(`revenue::VARCHAR ILIKE '%${req.query.search.value}%'`);
          params.push(`earnings::VARCHAR ILIKE '%${req.query.search.value}%'`);
        }

        if (query && params.length > 0) {
          params = params.join(" OR ");
          query = ` WHERE ${query} AND ${params}`;
        } else if (query) {
          query = ` WHERE ${query}`;
        } else if (params.length > 0) {
          query = ` WHERE ${params.join(" OR ")}`;
        }

        const limit = req.query.length;
        const offset = req.query.start;
        let sortBy = req.query.columns[req.query.order[0].column].data;
        const sortMode = req.query.order[0].dir;

        sortBy = sortBy = 'monthly' ? `to_date(monthly || ' 01', 'Mon YY DD')` : sortBy

        let queryTotal = `SELECT count(*) as TOTAL FROM pos_monthly_report${
          query ? query : ``
        }`;
        let queryData = `SELECT * FROM pos_monthly_report${
          query ? query : ``
        } ORDER BY ${sortBy} ${sortMode} LIMIT ${limit} OFFSET ${offset}`;

        const total = await db.query(queryTotal);
        const data = await db.query(queryData);

        const response = {
          draw: Number(req.query.draw),
          recordsTotal: total.rows[0].total,
          recordsFiltered: total.rows[0].total,
          data: data.rows,
        };

        res.json(response);
      } catch (error) {
        res.json(error);
      }
    });

  return router;
};
