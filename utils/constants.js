const success = "success";
const fail = "failed";

//authentication controller messages
const validEmail = "Please enter Email and Password";
const emptyUser = "No user with this email found!";
const invalidEmail = "Email or Password is Not Valid";
const expiredToken = "Your Login Token has been Expired, Please Login again";
const notLoggedIn = "You are not Logged In, Please Login First...";
const unauthorized = "You are not Authorized";

//Category Controller
const requiredImage = "Image is Required!!";
const emptyCategory = "Category not found";
const deletedCategory = "Category deleted Successfully"

// Reviews Controller
const requiredSubCategory = "Please provide subcategory";
const deletedReview = "Review deleted Successfully";
const emptyReview = "Review not found"

// Sub Category Controller
const emptySubCategory = "Sub Category not found";
const deletedSubCategory = "Sub Category deleted Successfully";

// Index 
const rateLimits = "Too many requests, please Comeback after an Hour!";
const invalidRoute = "Invalid Route"

// Export all Constants
module.exports = {
    invalidRoute, rateLimits, deletedSubCategory, unauthorized, success,
    emptySubCategory, emptyReview, deletedReview, requiredSubCategory, fail, deletedCategory,
    emptyCategory, requiredImage, validEmail, emptyUser, invalidEmail, expiredToken, notLoggedIn
}