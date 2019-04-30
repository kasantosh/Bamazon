## Bamazon App

This is a basic Amazon-like storefront created with the MySQL as database with node and javascript. The app will take in orders from customers and deplete stock from the store's inventory.

---

The first application is a javascript application running from a node server - bamazonCustomer.js. In this application the customer can view the database created earlier in MYSQL with a

1. Unique product id which auto increments
1. Product Name
1. Department Name
1. Product Price
1. Stock Quantity

This application when run displays the items in the database and lets the customer select a product ID and purchase. If the item ordered is more than available stock then it displays that there's not sufficient stock, if the order is within the limit then it allows the customer purchase the item and also subtracts form the database created earlier. Snapshots can be seen below:

Following is a display of the MYSQL table:

![](/images/bc-1.jpg)
As soon as the app is run it displays the table and an order was made for item_id: 5 for 20 units.

The following screen shot shows an order being places for item_id: 1 for 5 units but the order didn't go through because there wasn't enough stock!
![](/images/bc-2.jpg)

There is a second application that runs as a product manager (bamazonManager.js). This app has 4 options

1. View Products for Sale - lists every available item: the item IDs, names, prices, and quantities
1. View Low Inventory - lists all items with an inventory count lower than five.
1. Add to Inventory - displays a prompt that will let the manager "add more" of any item currently in the store
1. Add New Product - allows the manager to add a completely new product to the store.

The snapshot for the above is listed below in order:

![](/images/bm-1.jpg)
![](/images/bm-2.jpg)
![](/images/bm-3.jpg)
![](/images/bm-4.jpg)
