SELECT products.title as "Product name", count(products.id) as "count", users.email as "Buers email"
FROM users
JOIN purchases ON purchases.buyer = users.id
JOIN products ON products.id = purchases.product
WHERE users.star
GROUP BY
  users.id,
  users.email,
  products.title
 	