const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
// const postsController = requir../controllers/photossts");
const recipesController = require("../controllers/recipe");
const { ensureAuth } = require("../middleware/auth");

//Post Routes
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
// router.get("/:id", ensureAuth, postsController.getPost);
router.get("/:id", ensureAuth, recipesController.getRecipe);

//make favorites route, make suer they are still logged in, ensureAuth
//put in main routes routes/main.js, not a recipe, dont want /recipes/favorites i want /favorites
// router.get("/favorites", ensureAuth, recipesController.getFavorites);

//Enables user to create post w/ cloudinary for media uploads
// router.post("/createPost", upload.single("file"), postsController.createPost);
router.post("/createRecipe", upload.single("file"), recipesController.createRecipe);

router.post("/favoriteRecipe/:id", recipesController.favoriteRecipe);

//Enables user to like post. In controller, uses POST model to update likes by 1

router.put("/likeRecipe/:id", recipesController.likeRecipe);

// router.put("/favoriteRecipe/:id", recipesController.favoriteRecipe);  NO SHOULD BE A POST  make there

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
// router.delete("/deletePost/:id", postsController.deletePost);
router.delete("/deleteRecipe/:id", recipesController.deleteRecipe);

module.exports = router;
