#! /usr/bin/env node

const { Client } = require('pg')

if(process.env.NODE_ENV != 'production')
    require('dotenv').config()


const SQL = `
DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS supplier;

CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR (50) NOT NULL UNIQUE,
    CONSTRAINT min_len CHECK(char_length(category_name) >= 3)
)
;

CREATE TABLE IF NOT EXISTS supplier (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR (50) NOT NULL UNIQUE,
    address VARCHAR (100) NOT NULL,
    contact_number VARCHAR(25),
    registration_number INTEGER,
    CONSTRAINT min_len CHECK(char_length(supplier_name) >= 3)
)
;

CREATE TABLE IF NOT EXISTS item (
    item_id SERIAL,
    item_name VARCHAR (50) NOT NULL,
    supplier_id INTEGER REFERENCES supplier  ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    category_id INTEGER REFERENCES category ON DELETE RESTRICT,
    imgUrl VARCHAR (300) 
)
;

INSERT INTO category (category_name) VALUES
    ('Tablet'),
    ('Phone'),
    ('Phone Case'),
    ('Accessory'),
    ('PowerBank'),
    ('Earphone'),
    ('Soundbar'),
    ('Other')
;

INSERT INTO supplier (supplier_name, address, contact_number, registration_number) VALUES
    ('AAA Electronics Supply Sdn Bhd', '13 AAA BBB Jln AAA PJ 01, 12345, Selangor, Malaysia', '03-1234 5678', 10001234),

    ('BBB Trading Co Sdn Bhd', 'BBB Taman B, 12345, Selangor, Malaysia', '03-8888 8888 ', 10008888),

    ('CCC DigitalsExpert Sdn Bhd', 'Digital A, 12345, Selangor, Malaysia', '03-6666 1111', 10001111),

    ('DDD BerjayaToday Bhd', 'BerjayaToday Bhd Floor 43, KLCC, 12345, Kuala Lumpur, Malaysia', '03-8888 1234', 5555555)
;

INSERT INTO item (item_name, supplier_id, quantity, price, category_id, imgUrl) VALUES
    ('Iphone 14 Pro', 
    1, 
    10, 
    5000, 
    2, 
    'https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-7-1719311876728?_a=BAMADKa20'),
    
    ('Iphone 15 Pro Max', 
    1, 
    10, 
    7000, 
    2, 
    'https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-8-1719311885722?_a=BAMADKa20'),

    ('Ipad 10th', 
    2, 
    5, 
    2000, 
    1, 
    'https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-5-1719311854402?_a=BAMADKa20'),

    ('Lightning Cable 1m', 
    3, 
    15, 
    50, 
    4, 
    'https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-9-1719311896051?_a=BAMADKa20'),

    ('Lightning Cable 2m', 
    4, 
    10, 
    75, 
    4, 
    'https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-10-1719311907558?_a=BAMADKa20'),

    ('Home Pod', 
    3, 
    4, 
    800, 
    7, 
    'https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-4-1719311842454?_a=BAMADKa20'),

    ('Iphone 13', 
    1, 
    2, 
    2500, 
    8, 
    'https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-6-1719311866075?_a=BAMADKa20'),

    ('Airpod 1st gen', 
    2, 
    6, 
    1000, 
    6, 
    'https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-2-1719311793524?_a=BAMADKa20'),

    ('Airpod 2nd gen', 
    4,
    2, 
    1500, 
    6, 
    'https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-3-1719311828996?_a=BAMADKa20'),

    ('60W GaN Charger', 
    3,
    300, 
    200, 
    8, 
    'https://res.cloudinary.com/dd3egmona/image/upload/h_400,w_400/c_fill,g_auto/f_auto/v1/uploaded/tmp-1-1719311768708?_a=BAMADKa20')

;
`

async function main() {
    console.log('creating table and populating')
    console.log(process.env.DB_URI)
    const client = new Client({
        // connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/top_users",
        connectionString: process.env.DB_URI
    });

    await client.connect();
    await client.query(SQL);
    await client.end();

    console.log('done')
}

main()