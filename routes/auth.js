const express = require("express");
const passport = require("passport");
const router = express.Router();

// @desc Auth With Google
// @route GET /auth/google
router.get("/google", passport.authenticate("google", { scope: [ "profile" ] }));

// @desc Google Auth Callback
// @route GET /auth/google/callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (request, response) => {
    response.redirect("/dashboard");
});

// @desc Logout User
// @route GET /auth/logout
router.get("/logout", (request, response) => {
    request.logout();
    response.redirect("/");
});

module.exports = router;