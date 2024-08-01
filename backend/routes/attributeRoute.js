const express = require("express");
const router = express.Router();
const { getAttributes } = require("../controllers/attributeController");

router.get("/", getAttributes);

module.exports = router;
