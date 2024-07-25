const { generateImageUrl } = require('./cloudinary.js')

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const db = require('../db/query.js')

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of items, suppliers, and category counts (in parallel)
  const [
    numItem,
    numCategory,
    numSupplier,
  ] = await Promise.all([
    db.getAllItemCount(),
    db.getAllCategoryCount(),
    db.getAllSupplierCount(),
  ]);


  res.render("index", {
    title: "Catalogue Home",
    item_count: numItem,
    category_count: numCategory,
    supplier_count: numSupplier,
  });
});

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {

  const allItems = await db.getAllItem()

  res.render("item_list", { title: "Item List", item_list: allItems });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  // Get details of items
  const item = await db.getOneItemById(req.params.id)

  if (item === null) {
    // No results.
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    item: item,
  });
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  // Get all suppliers and categories, which we can use for adding to our item.
  const [allSuppliers, allCategories] = await Promise.all([
    db.getAllSupplier(),
    db.getAllCategory(),
  ]);

  res.render("item_form", {
    title: "Create Item",
    suppliers: allSuppliers,
    categories: allCategories,
  });
});

// Handle item create on POST.
exports.item_create_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("supplier", "Supplier must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("quantity")
    .trim()
    .isLength({ min: 1 })
    .withMessage("quantity must not be empty")
    .isNumeric()
    .withMessage("quantity number has non-numeric characters.")
    .escape(),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .withMessage("price must not be empty")
    .isNumeric()
    .withMessage("price has non-numeric characters.")
    .escape(),
  body("category", "category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    // const item = new Item({
    const item = {
      item_name: req.body.name,
      supplier_id: req.body.supplier,
      quantity: req.body.quantity,
      price: req.body.price,
      category_id: req.body.category,
      imgurl: req.body.imgUrl || '',
    };

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all suppliers and categories for form.
      const [allSuppliers, allCategories] = await Promise.all([
        db.getAllSupplier(),
        db.getAllCategory(),
      ]);

      res.render("item_form", {
        title: "Create Item",
        suppliers: allSuppliers,
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
    } else {
      if (req.files) {
        // if user upload photo, imgUrl will be overide with cloudinary generated url
        // upload photo to Cloudinary and get public id
        const uploadImage = req.files.uploadImage;
        let imageUrl = await generateImageUrl(uploadImage)
        item.imgurl = imageUrl
      }

      // Data from form is valid. Save Item.
      const returnId = await db.saveOneItem(item);
      res.redirect(`/catalog/item/${returnId}`);
    }
  }),
];

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  // Get detail of item
  const item = await db.getOneItemById(req.params.id)

  if (item === null) {
    // No results.
    res.redirect("/catalog/items");
  }

  res.render("item_delete", {
    title: "Delete Item",
    item: item,
  });
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to the list of items.
  await db.deleteOneItemById(req.body.itemId);
  res.redirect("/catalog/items");
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  // Get item, suppliers and categories for form.
  const [item, allSuppliers, allCategories] = await Promise.all([
    db.getOneItemById(req.params.id),
    db.getAllSupplier(),
    db.getAllCategory()
  ]);

  if (item.length === 0) {
    // No results.
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_form", {
    title: "Update Item",
    suppliers: allSuppliers,
    categories: allCategories,
    item: item,
  });
});

// Handle item update on POST.
exports.item_update_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("supplier", "Supplier must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("quantity")
    .trim()
    .isLength({ min: 1 })
    .withMessage("quantity must not be empty")
    .isNumeric()
    .withMessage("quantity number has non-numeric characters.")
    .escape(),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .withMessage("price must not be empty")
    .isNumeric()
    .withMessage("price has non-numeric characters.")
    .escape(),
  body("category", "category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped/trimmed data and old id.
    const item = {
      item_name: req.body.name,
      supplier_id: req.body.supplier,
      quantity: req.body.quantity,
      price: req.body.price,
      category_id: req.body.category,
      imgurl: req.body.imgUrl || '',
      item_id: req.params.id // This is required, for query
    };

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all suppliers and categories for form
      const [allSuppliers, allCategories] = await Promise.all([
        db.getAllSupplier(),
        db.getAllCategory(),
      ]);

      res.render("item_form", {
        title: "Update Item",
        suppliers: allSuppliers,
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
      return;
    } else {

      if (req.files) {
        // if user upload photo, imgUrl will be overide with cloudinary generated url
        // upload photo to Cloudinary and get public id
        const uploadImage = req.files.uploadImage;
        let imageUrl = await generateImageUrl(uploadImage)
        item.imgurl = imageUrl
      }

      // Data from form is valid. Update DB.
      const returnId = await db.updateOneItemById(req.params.id, item);
      res.redirect(`/catalog/item/${returnId}`);
    }
  }),
];
