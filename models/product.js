const fs = require("fs");
const path = require("path");
const Cart=require('./cart')
const p = path.join(
  path.dirname(process.memoryUsage().toString()),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
    if (this.id) {
      const existingProductIndex = products.findIndex(
        (prod) => prod.id === this.id
      );
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = this;
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
      });
    }
    else {
      this.id = Math.random().toString();
      getProductsFromFile((products) => {
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      });
    }
   }) 
   
  }

  static delete(id){
    getProductsFromFile((products) => {
      const product=products.find(prod=>prod.id===id)
      const updatedProduct = products.filter(p => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        if(!err){
          console.log('hii')
          Cart.deleteProduct(id,product.price)
        }
        
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
