const express = require("express");
const router = express.Router();  

//-- *********** Import Controller Functions *********** --//  
// const ProtectRoute = require("../controllers/AuthController");
const UserController = require("../controllers/UserController.js");
const { TrackDrivers } = require("../controllers/TrackingController.js");

//-- ********************* Routes ********************* --// 
router.get("/", (req,res) =>{
  res.send("Uber Api")
})

  //! *** User Routes ***!//
  router.route("/user")
  .get(UserController.GetUsers) /*** Get all Users ***/
  .post(UserController.AddUser) /*** Add New User ***/
router.route("/user/:id")
  .get(UserController.SingleUser) /*** Get a Single User ***/
  .patch(UserController.UpdateUser) /*** Update User ***/
  .delete(UserController.RemoveUser) /*** Remove User ***/
   

  // ! *** Tracking Nearest Drivers *** //
  router.get('/track', TrackDrivers);
  module.exports = router;


 