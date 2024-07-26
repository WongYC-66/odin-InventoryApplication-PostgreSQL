const db = require('../db/query.js')

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");


// Display list of all Suppliers.
exports.supplier_list = asyncHandler(async (req, res, next) => {
  const allSuppliers = await db.getAllSupplier()

  // console.log(allSuppliers)

  res.render("supplier_list",
    {
      title: "Supplier List",
      supplier_list: allSuppliers
    });
});

// Display detail page for a specific Supplier.
exports.supplier_detail = asyncHandler(async (req, res, next) => {
  // Get details of supplier and all their items (in parallel)
  const [supplier, allItemsBySupplier] = await Promise.all([
    db.getOneSupplierById(req.params.id),
    db.getItemsBySupplierId(req.params.id),
  ]);

  if (supplier === null) {
    // No results.
    const err = new Error("Supplier not found");
    err.status = 404;
    return next(err);
  }

  res.render("supplier_detail", {
    title: "Supplier Detail",
    supplier: supplier,
    supplier_items: allItemsBySupplier,
  });
});

// Display Supplier create form on GET.
exports.supplier_create_get = asyncHandler(async (req, res, next) => {
  res.render("supplier_form", { title: "Create Supplier" });
});

// Handle Supplier create on POST.
exports.supplier_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape()
    .withMessage("Supplier name must between 3 - 50 characters"),
  body("address")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Address must be between 1 - 100 characters"),
  body("contact_number")
    .trim()
    .escape()
    .optional({ values: "falsy" }),
  body("registration_number")
    .trim()
    .escape()
    .optional({ values: "falsy" })
    .isNumeric()
    .withMessage("registration number has non-numeric characters."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Supplier object with escaped and trimmed data
    const supplier = {
      supplier_name: req.body.name,
      address: req.body.address,
      contact_number: req.body.contact_number,
      registration_number: req.body.registration_number,
    };

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("supplier_form", {
        title: "Create Supplier",
        supplier: supplier,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save supplier.
      const returnId = await db.saveOneSupplier(supplier);
      // Redirect to new supplier record.
      res.redirect(`/catalog/supplier/${returnId}`);
    }
  }),
];

// Display Supplier delete form on GET.
exports.supplier_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of suppliers and all their items (in parallel)
  const [supplier, allItemsBySupplier] = await Promise.all([
    db.getOneSupplierById(req.params.id),
    db.getItemsBySupplierId(req.params.id),
  ]);

  if (supplier === null) {
    // No results.
    res.redirect("/catalog/suppliers");
  }

  res.render("supplier_delete", {
    title: "Delete Supplier",
    supplier: supplier,
    supplier_items: allItemsBySupplier,
  });
});

// Handle Supplier delete on POST.
exports.supplier_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of supplier and all their items (in parallel)
  const [supplier, allItemsBySupplier] = await Promise.all([
    db.getOneSupplierById(req.params.id),
    db.getItemsBySupplierId(req.params.id),
  ]);

  if (allItemsBySupplier.length > 0) {
    // Supplier has items. Render in same way as for GET route.
    res.render("supplier_delete", {
      title: "Delete Supplier",
      supplier: supplier,
      supplier_items: allItemsBySupplier,
    });
    return;
  } else {
    // Supplier has no items. Delete object and redirect to the list of suppliers.
    await db.deleteOneSupplierById(req.params.id);
    res.redirect("/catalog/suppliers");
  }
});

// Display Supplier update form on GET.
exports.supplier_update_get = asyncHandler(async (req, res, next) => {
  // Get item, suppliers and categories for form.
  const supplier = await db.getOneSupplierById(req.params.id)

  if (supplier.length  === 0) {
    // No results.
    const err = new Error("Supplier not found");
    err.status = 404;
    return next(err);
  }

  res.render("supplier_form", {
    title: "Update Supplier",
    supplier: supplier,
  });
});

// Handle Supplier update on POST.
exports.supplier_update_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape()
    .withMessage("Supplier name must between 3 - 50 characters"),
  body("address")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Address must be between 1 - 100 characters"),
  body("contact_number")
    .trim()
    .escape()
    .optional({ values: "falsy" }),
  body("registration_number")
    .trim()
    .escape()
    .optional({ values: "falsy" })
    .isNumeric()
    .withMessage("registration number has non-numeric characters."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Supplier object with escaped/trimmed data and old id.
    const supplier = {
      supplier_name: req.body.name,
      address: req.body.address,
      contact_number: req.body.contact_number,
      registration_number: req.body.registration_number,
      supplier_id: req.params.id, // for query
    };

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("supplier_form", {
        title: "Update Supplier",
        supplier: supplier,
        errors: errors.array(),
      });
      return;

    } else {
      // Data from form is valid. Update the record.
      const returnId = await db.updateOneSupplierById(req.params.id, supplier);
      
      // Redirect to supplier detail page.
      res.redirect(`/catalog/supplier/${returnId}`);
    }
  }),
];
