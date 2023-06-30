require('../models/database');
const Category = require('../models/category');
const Recipe = require('../models/recipe');



// GET homepage
exports.homepage = async(req,res)=>{
     try{

          const limitNumber = 5;     
          const categories = await Category.find({}).limit(limitNumber);
          const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);  
 
          const american = await Recipe.find({'category':'American'}).limit(limitNumber);
          const indian = await Recipe.find({'category':'Indian'}).limit(limitNumber);
          const chinese = await Recipe.find({'category':'Chinese'}).limit(limitNumber);

          const food = { latest,  american,indian, chinese }
   
          res.render('index', { title: 'Cooking Blog - Home', categories, food});
     }catch(error){
          res.status(500).send({message: error.message || "Error Occured"});
     }
}


//GET /categories
//Categories

exports.exploreCategories = async(req,res)=>{
     try{

          const limitNumber = 20;     
          const categories = await Category.find({}).limit(limitNumber); 
 
   
          res.render('categories', { title: 'Cooking Blog - Categories', categories});
     }catch(error){
          res.status(500).send({message: error.message || "Error Occured"});
     }
}
 

//GET /categories/:id
//Categories by id

exports.exploreCategoriesById = async(req,res)=>{
     try{

          let categoryId = req.params.id;

          const limitNumber = 20;     
          const categoryById = await Recipe.find({'category': categoryId}).limit(limitNumber); 
 
   
          res.render('categories', { title: 'Cooking Blog - Categories', categoryById});
     }catch(error){
          res.status(500).send({message: error.message || "Error Occured"});
     }
}



//GET /recipe/:id
//Recipe

exports.exploreRecipe = async(req,res)=>{
     try{

          let recipeId = req.params.id;
          const recipe = await Recipe.findById(recipeId);
 
   
          res.render('recipe', { title: 'Cooking Blog - Recipe', recipe});
     }catch(error){
          res.status(500).send({message: error.message || "Error Occured"});
     }
}

//POST /search
//search
exports.searchRecipe = async(req, res) => {
     try {
       let searchTerm = req.body.searchTerm;
       let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
       res.render('search', { title: 'Cooking Blog - Search', recipe } );
     } catch (error) {
       res.satus(500).send({message: error.message || "Error Occured" });
     }
     
   }



//GET /explore-latest
//Explore Latest

exports.exploreLatest = async(req,res)=>{
        try{
             
             const limitNumber = 20;     
             const recipe = await Recipe.find({}).sort({_id:-1}).limit(limitNumber); 
             res.render('explore-latest', { title: 'Cooking Blog - Explore latest', recipe});
        }catch(error){
             res.status(500).send({message: error.message || "Error Occured"});
        }
}


//GET /explore-random
//Explore Random

exports.exploreRandom = async(req,res)=>{
     try{
          
          let count = await Recipe.find().countDocuments();
          let random = Math.floor(Math.random()*count);
          let recipe = await Recipe.findOne().skip(random).exec();
          res.render('explore-random', { title: 'Cooking Blog - Explore random', recipe});
     }catch(error){
          res.status(500).send({message: error.message || "Error Occured"});
     }
}



//GET /submit-recipe
//Submit Recipe
exports.submitRecipe = async(req,res)=>{
     const infoErrorsObj = req.flash('infoErrors');
     const infoSubmitObj = req.flash('infoSubmit');
     res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj});
}


//POST /submit-recipe
//Submit Recipe
exports.submitRecipeOnPost = async(req, res) => {
     try {
   
       let imageUploadFile;
       let uploadPath;
       let newImageName;
   
       if(!req.files || Object.keys(req.files).length === 0){
         console.log('No Files where uploaded.');
       } else {
   
         imageUploadFile = req.files.image;
         newImageName = Date.now() + imageUploadFile.name;
   
         uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
   
         imageUploadFile.mv(uploadPath, function(err){
           if(err) return res.satus(500).send(err);
         })
   
       }
   
       const newRecipe = new Recipe({
         name: req.body.name,
         description: req.body.description,
         email: req.body.email,
         ingredients: req.body.ingredients,
         category: req.body.category,
         image: newImageName
       });
       
       await newRecipe.save();
   
       req.flash('infoSubmit', 'Recipe has been added.')
       res.redirect('/submit-recipe');
     } catch (error) {
       req.flash('infoErrors', error);
       res.redirect('/submit-recipe');
     }
   }



//Delete Recipe
// async function deleteRecipe(){
//      try{
//           await Recipe.deleteOne({name: ''});
//      }catch(error){
//           console.log(error);
//      }
// }

// deleteRecipe();


/*
  Dummy Data
*/


// async function insertDummyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDummyCategoryData();

// async function insertDummyRecipeData(){
//   try {
//     await recipe.insertMany([
//      [{
//          
   
//     
//         {
         
         
//         },
//   
//         {
//           "name": "Thai red chicken soup",
//           "description": "\n        Sit the chicken in a large, deep pan.\n        Carefully halve the squash lengthways, then cut into 3cm chunks, discarding the seeds.\n        Slice the coriander stalks, add to the pan with the squash, curry paste and coconut milk, then pour in 1 litre of water. Cover and simmer on a medium heat for 1 hour 20 minutes.\n        Use tongs to remove the chicken to a platter. Spoon any fat from the surface of the soup over the chicken, then sprinkle with half the coriander leaves.\n        Serve with 2 forks for divvying up the meat at the table. Use a potato masher to crush some of the squash, giving your soup a thicker texture.\n    \n        Source: https://www.jamieoliver.com/recipes/chicken-recipes/thai-red-chicken-soup/",
//           "email": "hello@email.com",
//           "ingredients": [
//             "1 x 1.6 kg whole free-range chicken",
//             "1 butternut squash (1.2kg)",
//             "1 bunch of fresh coriander (30g)"
//           ],
//           "category": "Thai",
//           "image": "thai-red-chicken-soup.jpg",
//         },
//         {
//        
//         {
//           "name": "Thai green curry",
//           "description": "Preheat the oven to 180ºC/350ºF/gas 4.\n        Wash the squash, carefully cut it in half lengthways and remove the seeds, then cut into wedges. In a roasting tray, toss with 1 tablespoon of groundnut oil and a pinch of sea salt and black pepper, then roast for around 1 hour, or until tender and golden.\n        For the paste, toast the cumin seeds in a dry frying pan for 2 minutes, then tip into a food processor.\n        Peel, roughly chop and add the garlic, shallots and ginger, along with the kaffir lime leaves, 2 tablespoons of groundnut oil, the fish sauce, chillies (pull off the stalks), coconut and most of the coriander (stalks and all).\n        Bash the lemongrass, remove and discard the outer layer, then snap into the processor, squeeze in the lime juice and blitz into a paste, scraping down the sides halfway.\n        Put 1 tablespoon of groundnut oil into a large casserole pan on a medium heat with the curry paste and fry for 5 minutes to get the flavours going, stirring regularly.\n        Tip in the coconut milk and half a tin’s worth of water, then simmer and thicken on a low heat for 5 minutes.\n    \n        Source: https://www.jamieoliver.com/recipes/butternut-squash-recipes/thai-green-curry/",
//           "email": "hello@email.com",
//           "ingredients": [
//             "1 butternut squash (1.2kg)",
//             "groundnut oil",
//             "12x 400 g tins of light coconut milk",
//             "400 g leftover cooked greens, such as",
//             "Brussels sprouts, Brussels tops, kale, cabbage, broccoli"
//           ],
//           "category": "Thai",
//           "image": "thai-green-curry.jpg",
//         },
//         {
//         {
//           "name": "New Chocolate Cake",
//           "description": "Chocolate Cake Description...",
//           "email": "hello@email.com",
//           "ingredients": [
//             "Water"
//           ],
//           "category": "Mexican",
//           "image": "chinese-steak-tofu-stew.jpg",
//         }]
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDummyRecipeData();
