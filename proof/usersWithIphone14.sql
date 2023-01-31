SELECT DISTINCT(email)
FROM users
JOIN purchases ON purchases.buyer = users.id
JOIN products ON purchases.product = products.id
WHERE products.title = 'iPhone 14'
