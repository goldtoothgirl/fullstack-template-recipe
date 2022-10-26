const cloudinary = require("../middleware/cloudinary");
// const Post = require("../models/Post");
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite");

module.exports = {
  getProfile: async (req, res) => { 
    console.log(req.user)
    try { 
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      // const posts = await Post.find({ user: req.user.id });
      const recipes = await Recipe.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
      // res.render("profile.ejs", { recipes: [const name line 13], user: req.user });  
      res.render("profile.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  //could also make a favorites section in profile or could make favorites controller
  getFavorites: async (req, res) => { 
    console.log(req.user)
    try { 
      //have favorites collection, find all favorites that matched logged in user, grab recipe value
      const recipes = await Favorite.find({ user: req.user.id }).populate('recipe');

      // console.log(recipes) - recipes is one level in .recipe
      // console.log(favorites)  
      //look in console log, array has one ogject in it
      
      //Sending post data from mongodb and user data to ejs template
      // res.render("profile.ejs", { recipes: [const name line 13], user: req.user });  
      res.render("favorites.ejs", { recipes: recipes, user: req.user });
     

    } catch (err) {
      console.log(err);
    }
  },
  getRecipe: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      //onst post = await Post.findById(req.params.id);
      const recipe = await Recipe.findById(req.params.id);
      res.render("recipe.ejs", { recipe: recipe, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  createRecipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
      //await Post.create({
      await Recipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  favoriteRecipe: async (req, res) => {
    try {
      //await Post.create({

      await Favorite.create({
        //need favotite model
        //grabbing logged in user
        user: req.user.id,
        //grabbing id from parameter
        recipe: req.params.id,
        // cloudinaryId: result.public_id,
        // ingredients: req.body.ingredients,
        // directions: req.body.directions,
        // likes: 0,
        // user: req.user.id,
      });
      console.log("Favorite has been added!");
      //getting id from a url, from logged in user
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likeRecipe: async (req, res) => {
    try {
      
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      // Find post by id
      let recipe = await Recipe.findById({ _id: req.params.id });
      // Delete image from cloudinary
      // await cloudinary.uploader.destroy(post.cloudinaryId);
      await cloudinary.uploader.destroy(recipe.cloudinaryId);
      // Delete post from db
      // await Post.remove({ _id: req.params.id });
      await Recipe.remove({ _id: req.params.id });

      console.log("Deleted Recipe");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
