SELECT
    coalesce(sum(sales.totalsum), 0) - coalesce(sum(purchases.totalsum), 0) AS earnings,
    coalesce(
        to_char(sales.time, 'Mon YY'),
        to_char(purchases.time, 'Mon YY')
    ) AS date
FROM
    sales FULL
    OUTER JOIN purchases ON sales.time = purchases.time
WHERE
    coalesce(
        to_char(purchases.time, 'YYYY-MM-DD'),
        to_char(sales.time, 'YYYY-MM-DD')
    ) BETWEEN '2022-12-03'
    AND '2022-12-06'
GROUP BY
    date
ORDER BY
    date DESC