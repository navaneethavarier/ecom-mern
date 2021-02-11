const express = require("express");
const router = express.Router();

const {getCategoryById, createCategory, getAllCategory, updateCategory, removeCategory, getCategory} = require("../controllers/category");
const {isAuthenticated, isAdmin, isSignedIn} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//Params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);


//Actual routers
router.post("/category/create/:userId", isSignedIn,isAuthenticated, isAdmin, createCategory);

//Read
router.get("/category/:categoryId", getCategory)
router.get("/categories", getAllCategory);

//update
router.put("/category/:categoryId/:userId", isSignedIn,isAuthenticated, isAdmin, updateCategory)

//delete
router.delete("/category/:categoryId/:userId", isSignedIn,isAuthenticated, isAdmin, removeCategory)


module.exports = router;