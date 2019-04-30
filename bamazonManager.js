var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysqlpass123456",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  manageProducts();
});

function manageProducts() {
  inquirer
    .prompt([
      {
        name: "manageProduct",
        message: "Manage your products...select from following options",
        type: "list",
        choices: [
          "View products for Sale",
          "View products with low inventory",
          "Add to inventory",
          "Add new product",
          "Exit"
        ]
      }
    ])
    .then(function(promptResponse) {
      switch (promptResponse.manageProduct) {
        case "View products for Sale": {
          viewProducts();

          break;
        }
        case "View products with low inventory": {
          checklowIntentory();

          break;
        }
        case "Add to inventory": {
          addtoInventory();
          break;
        }
        case "Add new product": {
          addnewProduct();
          break;
        }
        case "Exit": {
          connection.end();
          break;
        }
        default: {
          console.log("No options found");
        }
      }
    });
}
function viewProducts() {
  connection.query("SELECT * from products", function(err, response) {
    if (err) throw err;
    console.table(response);
    console.log("\n --------------------------------\n");
    manageProducts();
  });
}

function checklowIntentory() {
  connection.query("SELECT stock_quantity from products", function(
    err,
    response
  ) {
    if (err) throw err;
    var checker = false;
    for (var i = 0; i < response.length; i++) {
      if (response[i].stock_quantity < 5) {
        checker = true;
      }
    }

    if (checker) {
      connection.query(
        "SELECT * from products where stock_quantity < 5",
        function(err, response) {
          if (err) throw err;
          console.table(response);
          console.log("\n --------------------------------\n");
          manageProducts();
        }
      );
    } else {
      console.log("All items are well stocked up");
      console.log("\n --------------------------------\n");
      manageProducts();
    }
  });
}

function addtoInventory() {
  inquirer
    .prompt([
      {
        name: "id",
        message: "Enter product id",
        type: "input"
      },
      {
        message: "Enter the quantity you'd like to add",
        type: "number",
        name: "qty"
      }
    ])
    .then(function(promptAdd_response) {
      connection.query(
        "SELECT stock_quantity from products WHERE ?",
        {
          item_id: promptAdd_response.id
        },
        function(err, res) {
          if (err) throw err;

          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: res[0].stock_quantity + promptAdd_response.qty
              },
              {
                item_id: promptAdd_response.id
              }
            ],
            function(err) {
              if (err) throw err;
              console.log("\n --------------------------------\n");

              manageProducts();
            }
          );
        }
      );
    });
}

function addnewProduct() {
  inquirer
    .prompt([
      {
        name: "productName",
        message: "Enter product name",
        type: "input"
      },
      {
        name: "deptName",
        message: "Enter department",
        type: "input"
      },
      {
        name: "productPrice",
        message: "Enter price of the item",
        type: "input"
      },
      {
        name: "stockQty",
        message: "Enter the quantity purchased",
        type: "input"
      }
    ])
    .then(function(promptResponse) {
      connection.query(
        "INSERT into products set ?",
        {
          product_name: promptResponse.productName,
          department_name: promptResponse.deptName,
          price: promptResponse.productPrice,
          stock_quantity: promptResponse.stockQty
        },
        function(error) {
          if (error) throw error;
          console.log("Inserted new item to Database");
          console.log("\n --------------------------------\n");
          manageProducts();
        }
      );
    });
}
