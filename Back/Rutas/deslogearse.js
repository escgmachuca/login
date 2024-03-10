const express = require("express");
const router = express.Router();
const validateToken = require("../auth/validateToken");
router.delete("/", async (req, res, next) => {
try {
    const refreshToken = validateToken(req.headers);
    await Token.findOneAndRemove({ token: refreshToken});
    res.json({
        success: "token removed",
    });
    } catch (ex) { 
        return next(new Error("Error loging out the user" + ex.message));
    }
});

module.exports = router;