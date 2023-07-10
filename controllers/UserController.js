const User = require("../models/Users");
const ApiFeatures = require("../utils/ApiFeatures");
module.exports = {

  /*** Add User to Database ***/
  AddUser: async (req, res) => {
    try {
      const { name, email, password, phone, rating, role, longitude, latitude } = req.body;
      const coordinates = [parseFloat(longitude), parseFloat(latitude)];
      let data = {
        name,
        email,
        password,
        location: {
          type: 'Point',
          coordinates
        },
        phone,
        rating, 
        role, 
      }
      const user = await User.create(data);
      res.status(201).json({
        status: `success`,
        data: {
          user
        }
      });
    } catch (err) {
      res.status(500).send({ status: `fail`, message: err.message });
    }
  },

  /*** Get Users from Database ***/
  GetUsers: async (req, res) => {
    try {
      // let users = new ApiFeatures(User.find() , req.query).filter().Paginate().sort().LimitFields("email name");
      // Execute the Query
      const user = await User.find().select("-password -__v");
      res.status(200).json({
        status: `success`,
        results: user.length,
        data: {
          user
        }
      });
    } catch (err) {
      res.status(401).json({ status: `fail`, message: err.message });
    }
  },

  /*** get a sinfle User ***/
  SingleUser: async (req, res) => {
    try {
      let user = await User.findById(req.params.id).select("-password -__v");
      res.status(200).json({
        status: `success`,
        data: {
          user
        }
      });
    } catch (err) {
      res.status(500).json({ status: `${fail}`, message: err.message });
    }
  },

  /*** Update a User ***/
  UpdateUser: async (req, res) => {
    try {
      let record = await User.findById(req.params.id);
      if (!record) {
        res.status(404).json({ status: `${fail}`, message: 'User Not Found!' });
        return true;
      }
      let data = {
        name: req.body.name,
        email: req.body.email
      };
      console.log(req.body);
      const user = await User.findByIdAndUpdate(req.params.id, data, {
        new: true,
      }).select(-password -__v);
      res.status(203).json({
        status: `${success}`,
        data: {
          user
        }
      });
    } catch (err) {
      res.status(401).json({ status: `${fail}`, message: err.message });
    }
  },

  /*** Remove User ***/
  RemoveUser: async (req, res) => {
    try {
      let result = await User.findById(req.params.id);
      if (!result) {
        res.status(404).json({ status: `${fail}`, message: 'User not Found!' });
        return true;
      }
      await User.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: `${success}`,
        message: 'User deleted Successfully!'
      });
    } catch (err) {
      res.status(404).json({ status: `${fail}`, message: err.message });
    }
  },
};
