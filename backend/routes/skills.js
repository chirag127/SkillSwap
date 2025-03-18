const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
    getSkills,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill,
    getUserSkills,
    searchSkills,
} = require("../controllers/skills");

router.route("/").get(getSkills).post(protect, createSkill);

router.route("/search").get(searchSkills);

router.route("/user/:userId").get(getUserSkills);

router
    .route("/:id")
    .get(getSkill)
    .put(protect, updateSkill)
    .delete(protect, deleteSkill);

module.exports = router;
