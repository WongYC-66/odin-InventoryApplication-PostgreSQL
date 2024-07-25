const pool = require('./pool.js')

exports.saveOneItem = async (item) => {
    let { rows } = await pool.query(`
        INSERT INTO item (item_name, supplier_id, quantity, price, category_id, imgUrl) VALUES
            ('${item.item_name}',
            ${item.supplier_id}, 
            ${item.quantity}, 
            ${item.price}, 
            ${item.category_id}, 
            '${item.imgurl}') 
        RETURNING item_id
        ;   
        `
    )


    return rows[0].item_id
}

exports.getOneItemById = async (item_id) => {
    let { rows } = await pool.query(`
        SELECT * 
        FROM item LEFT JOIN category ON item.category_id = category.category_id
        LEFT JOIN supplier ON item.supplier_id = supplier.supplier_id
        WHERE item.item_id = ${item_id}
    `)
    rows = rows.map(data => {
        return {
            ...data,
            url: `/catalog/item/${data.item_id}`,
            supplier_url: `/catalog/supplier/${data.supplier_id}`,
            category_url: `/catalog/category/${data.category_id}`,
        }
    })
    return rows[0]
}

exports.deleteOneItemById = async (item_id) => {
    let { rows } = await pool.query(`
        DELETE  
        FROM item
        WHERE item_id = ${item_id}
    `)
    return
}

exports.updateOneItemById = async (id, item) => {
    let { rows } = await pool.query(`
        UPDATE item 
            SET item_name = '${item.item_name}',
                supplier_id = ${item.supplier_id} , 
                quantity = ${item.quantity}, 
                price = ${item.price}, 
                category_id = ${item.category_id},
                imgurl = '${item.imgurl}'
            WHERE item_id = ${id}
            RETURNING item_id
        ;   
        `
    )

    return rows[0].item_id
}

exports.getAllItem = async () => {
    let { rows } = await pool.query(`
        SELECT * 
        FROM item LEFT JOIN category ON item.category_id = category.category_id
        LEFT JOIN supplier ON item.supplier_id = supplier.supplier_id
        ORDER BY item.item_name;
    `)
    rows = rows.map(data => {
        return {
            ...data,
            url: `/catalog/item/${data.item_id}`,
            supplier_url: `/catalog/supplier/${data.supplier_id}`,
            category_url: `/catalog/category/${data.category_id}`,
        }
    })
    // console.log(rows)
    return rows
}

exports.getAllCategory = async () => {
    const { rows } = await pool.query(`
        SELECT * FROM category
        ORDER BY category_name
        ;
    `)
    // console.log(rows)
    return rows
}

exports.getAllSupplier = async () => {
    const { rows } = await pool.query(`
        SELECT * FROM supplier
        ORDER BY supplier_name
        ;
    `)
    // console.log(rows)

    return rows
}

exports.getAllItemCount = async () => {
    const { rows } = await pool.query("SELECT COUNT(*) FROM item;")
    return rows[0].count
}

exports.getAllCategoryCount = async () => {
    const { rows } = await pool.query("SELECT COUNT(*) FROM category;")
    return rows[0].count
}

exports.getAllSupplierCount = async () => {
    const { rows } = await pool.query("SELECT COUNT(*) FROM supplier;")
    return rows[0].count
}


