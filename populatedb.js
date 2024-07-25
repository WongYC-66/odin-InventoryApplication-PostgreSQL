#! /usr/bin/env node

console.log(
  'This script populates some test items, suppliers, categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_inventoryretryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Supplier = require("./models/supplier");
const Category = require("./models/category");

const categories = [];
const suppliers = [];
const items = [];

const mongoose = require("mongoose");
const category = require("./models/category");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createSuppliers();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categeoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function suppplierCreate(index, name, address, contact_number, registration_number) {
  const supplierDetail = { name, address, contact_number, registration_number };

  const supplier = new Supplier(supplierDetail);

  await supplier.save();
  suppliers[index] = supplier;
  console.log(`Added supplier: ${name}`);
}

async function itemCreate(index, name, supplier, quantity, price, category, imgUrl) {
  const itemDetail = {
    name,
    supplier,
    quantity,
    price,
    category,
    imgUrl
  };
  if (category != false) itemDetail.category = category;

  const item = new Item(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding createCategories");
  await Promise.all([
    categeoryCreate(0, "Tablet"),
    categeoryCreate(1, "Phone"),
    categeoryCreate(2, "Phone Case"),
    categeoryCreate(3, "Accessory"),
    categeoryCreate(4, "PowerBank"),
    categeoryCreate(5, "Earphone"),
    categeoryCreate(6, "Soundbar"),
    categeoryCreate(7, "Other"),
  ]);
}

async function createSuppliers() {
  console.log("Adding authors");
  await Promise.all([
    suppplierCreate(0, "AAA Electronics Supply Sdn Bhd", "13 AAA BBB Jln AAA PJ 01, 12345, Selangor, Malaysia", "03-1234 5678", 10001234),
    suppplierCreate(1, "BBB Trading Co Sdn Bhd", "BBB Taman B, 12345, Selangor, Malaysia", "03-8888 8888 ", 10008888),
    suppplierCreate(2, "CCC DigitalsExpert Sdn Bhd", "Digital A, 12345, Selangor, Malaysia", "03-6666 1111", 10001111),
    suppplierCreate(3, "DDD BerjayaToday Bhd", "BerjayaToday Bhd Floor 43, KLCC, 12345, Kuala Lumpur, Malaysia", "03-8888 1234", 5555555),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate(0,
      "Iphone 14 Pro",
      suppliers[0],
      10,
      5000,
      categories[1],
      "https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-7-1719311876728?_a=BAMADKa20",
    ),
    itemCreate(1,
      "Iphone 15 Pro Max",
      suppliers[0],
      10,
      7000,
      categories[1],
      "https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-8-1719311885722?_a=BAMADKa20",
    ),
    itemCreate(2,
      "Ipad 10th",
      suppliers[1],
      5,
      2000,
      categories[0],
      "https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-5-1719311854402?_a=BAMADKa20",
    ),
    itemCreate(3,
      "Lightning Cable 1m",
      suppliers[2],
      15,
      50,
      categories[3],
      "https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-9-1719311896051?_a=BAMADKa20",
    ),
    itemCreate(4,
      "Lightning Cable 2m",
      suppliers[3],
      10,
      75,
      categories[3],
      "https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-10-1719311907558?_a=BAMADKa20",
    ),
    itemCreate(5,
      "Home Pod",
      suppliers[2],
      3,
      800,
      categories[6],
      "https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-4-1719311842454?_a=BAMADKa20"
    ),
    itemCreate(6,
      "Iphone 13",
      suppliers[0],
      1,
      2500,
      categories[1],
      "https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-6-1719311866075?_a=BAMADKa20",
    ),
    itemCreate(7,
      "Airpod 1st Gen",
      suppliers[1],
      5,
      1000,
      categories[5],
      "https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-2-1719311793524?_a=BAMADKa20",
    ),
    itemCreate(8,
      "Airpod 2nd Gen",
      suppliers[3],
      1,
      1500,
      categories[5],
      "https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-3-1719311828996?_a=BAMADKa20",
    ),
    itemCreate(9,
      "60W GaN Charger",
      suppliers[2],
      300,
      200,
      categories[7],
      "https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-1-1719311768708?_a=BAMADKa20",
    ),
  ]);
}
