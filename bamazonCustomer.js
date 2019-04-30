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
  //console.log("connected as id " + connection.threadId);
  displayProducts();
});

function displayProducts() {
  connection.query("SELECT * FROM products", function(err, response) {
    if (err) throw err;
    console.table(response);
    placeOrder();
  });
}

function placeOrder() {
  inquirer
    .prompt([
      {
        message: "Enter the product id for placing an order",
        type: "input",
        name: "id"
      },
      {
        message: "Enter the quantity you'd like to order",
        type: "number",
        name: "qty"
      }
    ])
    .then(function(promptResponse) {
      connection.query(
        "SELECT stock_quantity, price FROM products WHERE ?",
        {
          item_id: promptResponse.id
        },
        function(err, res) {
          if (err) throw err;
          if (promptResponse.qty > res[0].stock_quantity) {
            if (res[0].stock_quantity === 0) {
              console.log("Sorry, Out of Stock");
            } else {
              console.log(`Only ${res[0].stock_quantity} available.`);
            }
          } else {
            console.log("Your order has been placed");
            //console.log(res[0].price);
            console.log(
              `Your total cost is ${res[0].price * promptResponse.qty}`
            );
            console.log("_______________________________");
            connection.query("UPDATE products SET ? WHERE ?", [
              {
                stock_quantity: res[0].stock_quantity - promptResponse.qty
              },
              {
                item_id: promptResponse.id
              }
            ]);
          }
          inquirer
            .prompt([
              {
                name: "Option",
                massage: "Choose one of the following?",
                type: "list",
                choices: ["Exit", "Place an order for another item"]
              }
            ])
            .then(function(prompt_res) {
              switch (prompt_res.Option) {
                case "Place an order for another item": {
                  displayProducts();
                  break;
                }
                case "Exit": {
                  connection.end();
                  break;
                }
                default: {
                  connection.end();
                  break;
                }
              }
            });
          // connection.end();
        }
      );
    });
}
