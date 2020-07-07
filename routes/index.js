const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../middleware/ensureAuth");
const Story = require("../models/Story");

// @desc Login/Landing Page
// @route GET /
router.get("/", ensureGuest, (request, response) => {
    response.render("home", {
        layout: "login"
    });
});

// @desc Dashboard Page
// @route GET /dashboard
router.get("/dashboard", ensureAuthenticated, async (request, response) => {
    try {
        const stories = await Story.find({ user: request.user.id }).lean();
        response.render("dashboard", {
        name: request.user.firstName,
        stories
    });
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
});

module.exports = router;