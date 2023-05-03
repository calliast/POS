SELECT
    coalesce(sum(sales.totalsum), 0) AS revenue,
    coalesce(sum(purchases.totalsum), 0) AS expense,
    coalesce(sum(sales.totalsum), 0) - coalesce(sum(purchases.totalsum), 0) AS earnings,
    coalesce(
        to_char(purchases.time, 'Mon YY'),
        to_char(sales.time, 'Mon YY')
    ) AS monthly
FROM
    sales FULL
    OUTER JOIN purchases ON sales.time = purchases.time
WHERE
    coalesce(
        to_char(purchases.time, 'YYYY-MM-DD'),
        to_char(sales.time, 'YYYY-MM-DD')
    ) BETWEEN '2022-11-05'
    AND '2023-02-05'
GROUP BY
    monthly
ORDER BY
    monthly
SELECT
    COUNT(*) AS timessales,
    SUM(totalsum) AS totalsales,
    (
        SELECT
            SUM(totalsum)
        FROM
            purchases
    ) AS totalpurchases,
    SUM(totalsum) - (
        SELECT
            SUM(totalsum)
        FROM
            purchases
    ) AS earnings,
    coalesce(
        to_char(purchases.time, 'Mon YY'),
        to_char(sales.time, 'Mon YY')
    ) AS monthly
FROM
    sales
WHERE
    coalesce(
        to_char(purchases.time, 'YYYY-MM-DD'),
        to_char(sales.time, 'YYYY-MM-DD')
    ) BETWEEN '2022-11-05'
    AND '2023-02-05'
SELECT
    COUNT(*) AS timessales,
    SUM(sales.totalsum) AS totalsales,
    SUM(purchases.totalsum) AS totalpurchases,
    SUM(sales.totalsum) - SUM(purchases.totalsum) AS earnings
FROM
    sales,
    purchases
SELECT
    sum(
        CASE
            WHEN sales.customer = 1 THEN 1
            ELSE 0
        END
    ) AS direct,
    sum(
        CASE
            WHEN sales.customer = 2 THEN 1
            ELSE 0
        END
    ) AS customer
FROM
    sales
    LEFT JOIN customers ON customers.customerid = sales.customer
    LEFT JOIN purchases ON purchases.time = sales.time
SELECT
    COUNT(*) AS timessales,
    to_char(s.time, 'Mon YY') AS date
FROM
    sales s
SELECT
    COUNT(*) AS timessales,
    SUM(totalsum) AS totalsales,
    (
        SELECT
            SUM(totalsum)
        FROM
            purchases
    ) AS totalpurchases,
    SUM(totalsum) - (
        SELECT
            SUM(totalsum)
        FROM
            purchases
    ) AS earnings
FROM
    sales -- TOTAL PURCHASES
SELECT
    SUM(purchases.totalsum) AS totalpurchases,
    coalesce(
        to_char(purchases.time, 'Mon YY'),
        to_char(sales.time, 'Mon YY')
    ) AS date
FROM
    purchases
    LEFT JOIN sales ON sales.time = purchases.time
WHERE
    coalesce(
        to_char(purchases.time, 'YYYY-MM-DD'),
        to_char(sales.time, 'YYYY-MM-DD')
    ) BETWEEN '2022-11-05'
    AND '2023-03-15'
GROUP BY
    date
ORDER BY
    date -- TOTALSALES
SELECT
    SUM(sales.totalsum) AS totalsales,
    coalesce(
        to_char(purchases.time, 'Mon YY'),
        to_char(sales.time, 'Mon YY')
    ) AS date
FROM
    sales
    LEFT JOIN purchases ON purchases.time = sales.time
WHERE
    coalesce(
        to_char(purchases.time, 'YYYY-MM-DD'),
        to_char(sales.time, 'YYYY-MM-DD')
    ) BETWEEN '2022-11-05'
    AND '2023-03-15'
GROUP BY
    date
ORDER BY
    date -- TOTALSALES ALTERNATIVE
SELECT
    SUM(s.totalsum) AS totalsales,
    COALESCE(
        to_char(date_trunc('month', p.time), 'Mon YY'),
        to_char(date_trunc('month', s.time), 'Mon YY')
    ) AS date
FROM
    sales s
    LEFT JOIN purchases p ON date_trunc('day', p.time) = date_trunc('day', s.time)
WHERE
    date_trunc('day', COALESCE(p.time, s.time)) BETWEEN '2022-11-05'
    AND '2023-03-15'
GROUP BY
    date
ORDER BY
    date -- MONTHLY REPORT
SELECT
    coalesce(sum(sales.totalsum), 0) AS revenue,
    coalesce(sum(purchases.totalsum), 0) AS expense,
    coalesce(sum(sales.totalsum), 0) - coalesce(sum(purchases.totalsum), 0) AS earnings,
    coalesce(
        to_char(purchases.time, 'Mon YY'),
        to_char(sales.time, 'Mon YY')
    ) AS monthly
FROM
    sales FULL
    OUTER JOIN purchases ON sales.time = purchases.time $ { params.length > 0 ? ` WHERE ${params.join(" OR ")}`: "" }
GROUP BY
    monthly
ORDER BY
    monthly -- STATISTICS
SELECT
    SUM(totalsum) AS totalsales,
    (
        SELECT
            SUM(totalsum)
        FROM
            purchases
    ) AS totalpurchases
FROM
    sales
    LEFT JOIN purchases ON purchases.time = sales.time
WHERE
    coalesce(
        to_char(purchases.time, 'YYYY-MM-DD'),
        to_char(sales.time, 'YYYY-MM-DD')
    ) BETWEEN '2022-11-05'
    AND '2023-03-15' -- NEW MONTHLY REPORT
SELECT
    coalesce(sum(sales.totalsum), 0) AS revenue,
    coalesce(sum(purchases.totalsum), 0) AS expense,
    coalesce(sum(sales.totalsum), 0) - coalesce(sum(purchases.totalsum), 0) AS earnings,
    coalesce(
        to_char(purchases.time, 'Mon YY'),
        to_char(sales.time, 'Mon YY')
    ) AS monthly
FROM
    sales FULL
    OUTER JOIN purchases ON sales.time = purchases.time
WHERE
    monthly ILIKE '%mar%'
    OR expense :: VARCHAR ILIKE '%mar%'
    OR revenue :: VARCHAR ILIKE '%mar%'
    OR earnings :: VARCHAR ILIKE '%mar%'
    AND coalesce(
        to_char(purchases.time, 'YYYY-MM-DD'),
        to_char(sales.time, 'YYYY-MM-DD')
    ) BETWEEN '2022-11-05'
    AND '2023-02-05'
ORDER BY
    monthly ASC
LIMIT
    3 OFFSET 0 -- OLD MONTHLY REPORT
SELECT
    coalesce(sum(sales.totalsum), 0) AS revenue,
    coalesce(sum(purchases.totalsum), 0) AS expense,
    coalesce(sum(sales.totalsum), 0) - coalesce(sum(purchases.totalsum), 0) AS earnings,
    coalesce(
        to_char(purchases.time, 'Mon YY'),
        to_char(sales.time, 'Mon YY')
    ) AS monthly
FROM
    sales FULL
    OUTER JOIN purchases ON sales.time = purchases.time -- CHART NEW QUERY
SELECT
    coalesce(sum(sales.totalsum), 0) - coalesce(sum(purchases.totalsum), 0) AS earnings,
    coalesce(
        to_char(purchases.time, 'Mon YY'),
        to_char(sales.time, 'Mon YY')
    ) AS monthly
FROM
    sales FULL
    OUTER JOIN purchases ON sales.time = purchases.time
WHERE
    coalesce(
        to_char(purchases.time, 'YYYY-MM-DD'),
        to_char(sales.time, 'YYYY-MM-DD')
    ) BETWEEN '2022-10-05'
    AND '2023-01-15'
GROUP BY
    monthly
ORDER BY
    to_date(
        coalesce(
            to_char(purchases.time, 'Mon YY'),
            to_char(sales.time, 'Mon YY')
        ) || ' 01',
        'Mon YY DD'
    )
SELECT
    coalesce(sum(sales.totalsum), 0) AS totalsales,
    coalesce(
        (
            SELECT
                SUM(purchases.totalsum)
            FROM
                purchases
        ),
        0
    ) AS totalpurchases
FROM
    sales
    LEFT JOIN purchases ON purchases.time = sales.time
SELECT
    coalesce(sum(sales.totalsum), 0) AS totalsales,
    coalesce(
        (
            SELECT
                SUM(purchases.totalsum)
            FROM
                purchases
        ),
        0
    ) AS totalpurchases
FROM
    sales
    LEFT JOIN purchases ON purchases.time = sales.time
WHERE
    coalesce(
        to_char(purchases.time, 'YYYY-MM-DD'),
        to_char(sales.time, 'YYYY-MM-DD')
    ) <= '2022-11-01'