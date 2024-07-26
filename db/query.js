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

exports.getItemsBySupplierId = async (supplier_id) => {
    let { rows } = await pool.query(`
        SELECT * 
        FROM item LEFT JOIN category ON item.category_id = category.category_id
        LEFT JOIN supplier ON item.supplier_id = supplier.supplier_id
        WHERE item.supplier_id = ${supplier_id}
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

exports.getOneSupplierById = async (supplier_id) => {
    let { rows } = await pool.query(`
        SELECT * 
        FROM supplier
        WHERE supplier_id = ${supplier_id}
    `)
    rows = rows.map(data => {
        return {
            ...data,
            supplier_url: `/catalog/supplier/${data.supplier_id}`,
        }
    })

    return rows[0]
}

exports.saveOneSupplier = async (supplier) => {
    let { rows } = await pool.query(`
        INSERT INTO supplier (supplier_name, address, contact_number, registration_number) 
        VALUES (
            '${supplier.supplier_name}',
            '${supplier.address}', 
            '${supplier.contact_number}', 
            ${supplier.registration_number}
        )

        RETURNING supplier_id
        ;   
        `
    )

    return rows[0].supplier_id
}

exports.deleteOneSupplierById = async (supplier_id) => {
    let { rows } = await pool.query(`
        DELETE  
        FROM supplier
        WHERE supplier_id = ${supplier_id}
        ;
    `)
    return
}

exports.updateOneSupplierById = async (id, supplier) => {
    let { rows } = await pool.query(`
        UPDATE supplier 
            SET supplier_name = '${supplier.supplier_name}',
                address = '${supplier.address}',
                contact_number = '${supplier.contact_number}',
                registration_number = ${supplier.registration_number}
            WHERE supplier_id = ${id}
            RETURNING supplier_id
        ;   
        `
    )

    return rows[0].supplier_id
}

exports.getOneCategoryById = async (category_id) => {
    let { rows } = await pool.query(`
        SELECT * 
        FROM category
        WHERE category_id = ${category_id}
    `)
    rows = rows.map(data => {
        return {
            ...data,
            category_url: `/catalog/category/${data.category_id}`,
        }
    })

    return rows[0]
}
exports.getOneCategoryByName = async (category_name) => {
    let { rows } = await pool.query(`
        SELECT * 
        FROM category
        WHERE category_name = '${category_name}'
        ;
    `)
    rows = rows.map(data => {
        return {
            ...data,
            category_url: `/catalog/category/${data.category_id}`,
        }
    })

    return rows[0]
}

exports.getItemsByCategoryId = async (category_id) => {
    let { rows } = await pool.query(`
        SELECT * 
        FROM item LEFT JOIN category ON item.category_id = category.category_id
        LEFT JOIN supplier ON item.supplier_id = supplier.supplier_id
        WHERE item.category_id = ${category_id}
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

exports.saveOneCategory = async (category) => {
    let { rows } = await pool.query(`
        INSERT INTO category (category_name) 
        VALUES (
            '${category.category_name}'
        )

        RETURNING category_id
        ;   
        `
    )

    return rows[0].category_id
}

exports.deleteOneCategoryById = async (category_id) => {
    let { rows } = await pool.query(`
        DELETE  
        FROM category
        WHERE category_id = ${category_id}
        ;
    `)
    return
}

exports.updateOneCategoryById = async (id, category) => {
    let { rows } = await pool.query(`
        UPDATE category 
            SET category_name = '${category.category_name}'
            WHERE category_id = ${id}
            RETURNING category_id
        ;   
        `
    )

    return rows[0].category_id
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
    let { rows } = await pool.query(`
        SELECT * FROM category
        ORDER BY category_name
        ;
    `)
    rows = rows.map(data => {
        return {
            ...data,
            category_url: `/catalog/category/${data.category_id}`,
        }
    })
    // console.log(rows)
    return rows
}

exports.getAllSupplier = async () => {
    let { rows } = await pool.query(`
        SELECT * FROM supplier
        ORDER BY supplier_name
        ;
    `)

    rows = rows.map(data => {
        return {
            ...data,
            supplier_url: `/catalog/supplier/${data.supplier_id}`,
        }
    })
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


