const db = require('./src/config/database');

db.exec('DELETE FROM products;');
db.exec('DELETE FROM orders;');
db.exec('DELETE FROM inventory;');
db.exec('DELETE FROM customers;');
db.exec('DELETE FROM promotions;');
db.exec('DELETE FROM inventory_dockets;');
db.exec('DELETE FROM reservations;');
db.exec('DELETE FROM top_items;');
db.exec('DELETE FROM weekly_revenue;');
db.exec("DELETE FROM staff WHERE username NOT IN ('admin_khang', 'thukho');");

console.log('✅ Successfully cleared all sample data from SQLite database!');
console.log('Products:', db.prepare('SELECT COUNT(*) as c FROM products').get().c);
console.log('Orders:', db.prepare('SELECT COUNT(*) as c FROM orders').get().c);
console.log('Inventory:', db.prepare('SELECT COUNT(*) as c FROM inventory').get().c);
console.log('Customers:', db.prepare('SELECT COUNT(*) as c FROM customers').get().c);
console.log('Promotions:', db.prepare('SELECT COUNT(*) as c FROM promotions').get().c);
console.log('Staff:', db.prepare('SELECT id, name, username, role FROM staff').all());
