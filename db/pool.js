const pg = require('pg')
const { Pool } = pg

const connectionString = process.env.DB_URI
const pool = new Pool({
    connectionString
})

module.exports = pool