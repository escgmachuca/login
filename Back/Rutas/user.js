const express = require("express");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();
const log = require("../lib/trace");

router.get("/", async function (req, res, next) {
    log.info("user", req.user);
    res.json(jsonResponse(200, req.user));
});

module.exports = router;