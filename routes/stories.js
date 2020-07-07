const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/ensureAuth");
const Story = require("../models/Story");

// @desc Show Add Page
// @route GET /stories/add
router.get("/add", ensureAuthenticated, (request, response) => {
    response.render("stories/add");
});

// @desc Process Add Form
// @route POST /stories
router.post("/", ensureAuthenticated, async (request, response) => {
    try {
        request.body.user = request.user.id;
        await Story.create(request.body);
        response.redirect("/dashboard");
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
});

// @desc Show All Stories
// @route GET /stories
router.get("/", ensureAuthenticated, async (request, response) => {
    try {
        const stories = await Story.find({ status: "public" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();
        response.render("stories/index", {
            stories
        });
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
});

// @desc Show Single Story
// @route GET /stories/:id
router.get("/:id", ensureAuthenticated, async (request, response) => {
    try {
        let story = await Story.findById(request.params.id)
            .populate("user")
            .lean();
        if (!story) {
            return response.render("errors/404");
        }
        response.render("stories/show", {
            story
        });
    } catch (error) {
        console.log(error);
        response.render("errors/404");
    }
});

// @desc Show Edit Page
// @route GET /stories/edit/:id
router.get("/edit/:id", ensureAuthenticated, async (request, response) => {
    try {
        const story = await Story.findOne({ _id: request.params.id }).lean();
        if (!story) {
            return response.render("errors/404");
        }
        if (story.user != request.user.id) {
            response.redirect("/stories");
        } else {
            response.render("stories/edit", {
                story
            });
        }
    } catch (error) {
        console.log(error);
        return response.render("errors/500");
    }
});

// @desc Update Story
// @route GET /stories/:id
router.put("/:id", ensureAuthenticated, async (request, response) => {
    try {
        let story = await Story.findById(request.params.id).lean();
        if(!story) {
            return response.render("errors/404")
        }
        if (story.user != request.user.id) {
            response.redirect("/stories");
        } else {
            story = await Story.findOneAndUpdate({ _id: request.params.id }, request.body, {
                new: true,
                runValidators: true
            });
            response.redirect("/dashboard");
        }
    } catch (error) {
        console.log(error);
        return response.render("errors/500");
    }
});

// @desc Delete Story
// @route DELETE /stories/:id
router.delete("/:id", ensureAuthenticated, async (request, response) => {
    try {
        await Story.remove({ _id: request.params.id });
        response.redirect("/dashboard");
    } catch (error) {
        console.log(error);
        return response.render("errors/500");
    }
});

// @desc User Stories
// @route GET /stories/user/:userId
router.get("/user/:userId", ensureAuthenticated, async (request, response) => {
    try {
        const stories = await Story.find({
            user: request.params.userId,
            status: "public"
        }).populate("user").lean();
        response.render("stories/index", {
            stories
        });
    } catch (error) {
        console.log(error);
        response.render("errors/500");
    }
});

module.exports = router;