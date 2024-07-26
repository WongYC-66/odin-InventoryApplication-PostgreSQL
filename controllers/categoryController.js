const db = require('../db/query.js')

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Category.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await db.getAllCategory()

  res.render("category_list", { title: "Category List", category_list: allCategories });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  // Get details of category and all associated items (in parallel)
  const [category, itemsInCategory] = await Promise.all([
    db.getOneCategoryById(req.params.id),
    db.getItemsByCategoryId(req.params.id),
  ]);
  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_items: itemsInCategory,
  });

});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = { category_name: req.body.name };

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      const categoryExists = await db.getOneCategoryByName(req.body.name)
      if (categoryExists) {
        // Category exists, redirect to its detail page.
        res.redirect(categoryExists.category_url);
      } else {
        // not duplicate
        const returnId = await db.saveOneCategory(category);
        // New category saved. Redirect to category detail page.
        res.redirect(`/catalog/category/${returnId}`);
      }
    }
  }),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of category and all their items (in parallel)
  const [category, allItemsByCategory] = await Promise.all([
    db.getOneCategoryById(req.params.id),
    db.getItemsByCategoryId(req.params.id),
  ]);

  if (!category) {
    // No results.
    res.redirect("/catalog/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_items: allItemsByCategory,
  });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of category and all their items (in parallel)
  const [category, allItemsByCategory] = await Promise.all([
    db.getOneCategoryById(req.params.id),
    db.getItemsByCategoryId(req.params.id),
  ]);

  if (allItemsByCategory.length > 0) {
    // Category has items. Render in same way as for GET route.
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_items: allItemsByCategory,
    });
    return;

  } else {
    // Category has no items. Delete object and redirect to the list of category.
    await db.deleteOneSupplierById(req.body.categoryId);
    res.redirect("/catalog/categories");
  }
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  // Get category to form.
  const category = await db.getOneCategoryById(req.params.id)

  if (!category) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update Category",
    category: category,
  });
});

// Handle Category update on POST.
exports.category_update_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped/trimmed data and old id.
    const category = { 
      category_name: req.body.name,
      category_id: req.params.id, // for query
    };

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("category_form", {
        title: "Update Supplier",
        category: category,
        errors: errors.array(),
      });
      return;

    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      const categoryExists = await db.getOneCategoryByName(req.body.name)

      if (categoryExists) {
        // Category exists, redirect to its detail page.
        res.redirect(categoryExists.category_url);
      } else {
        // No duplicate of category. Update the record.
        const returnId = await db.updateOneCategoryById(req.params.id, category);
        // Redirect to category detail page.
        res.redirect(`/catalog/category/${returnId}`);
      }
    }
  }),
];
