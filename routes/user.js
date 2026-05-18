const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require ("passport")
const { saveRedirectUrl} = require("../middleware.js")

const usercontroller = require("../controllers/users.js")

router.route("/signup")
.get(usercontroller.renderform)
.post(wrapAsync(usercontroller.signup));


router.route("/login")
.get( usercontroller.loginform)
.post(
    saveRedirectUrl ,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), 
    usercontroller.longinup

    
);

router.get("/logout",usercontroller.logoutform);


module.exports = router;