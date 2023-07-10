const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required!"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is Required!"],
    minLength: [8, "Password must have at least 8 characters long!"],
    // select: false,
  },
  phone: {
    type: String,
    required: [true, "Phone Number is Required"],
    minLength: [8, "Please enter a valid phone number"],
  },
  role: {
    type: String,
    enum: ['rider', 'driver'],
    required: [true, 'Please Specify a valid role']
  },
  rating: {
    type: String,
    enum: ['0', '1', '2', '3', '4', '5'],
    default: '0',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
      validate: {
        validator: function (value) {
          // Validate that there are exactly two coordinates
          if (!Array.isArray(value) || value.length !== 2) {
            return false;
          }
          // Validate longitude and latitude ranges
          const [longitude, latitude] = value;
          return longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;
        },
        message: 'Please Enter Correct Latitude and Longitude!'
      }
     }
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Busy', 'Unavailable', 'Arriving'],
    default: 'Offline', // Set the default status to 'Offline'
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  }
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12)
  next();
})

UserSchema.index({ location: '2dsphere' });
const User = mongoose.model("User", UserSchema);
module.exports = User;
