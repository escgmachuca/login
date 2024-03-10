const express = require ("express");
const User = require("../schema/user");
const { jsonResponse } = require("../lib/jsonResponse");
const getUserInfo = require("../lib/getUserInfo");
const router = express.Router();

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if(!!! username || !!! password){
        return res.status(400).json(jsonResponse(400, {
            error: "Campos requeridos",
        })
        );
    }
    const user = await User.findOne({ username });
    if (user) { 
        const correctPassword = await user.comparePassword(password, user.password);
        if(correctPassword) {
                //autenticar usuario
    const accessToken = user.createAccessToken();
    const refreshToken = await user.createRefreshToken();
    res
    .status(200)
    .json(
        jsonResponse(200, {
            user: getUserInfo(user),
             accessToken,
              refreshToken})
              );
        }else{
            res.status(400).json(
                jsonResponse(400,{
                    error: "usuario o contraseña incorrectos",
                })
            ); 
        }
    }else{
        res.status(400).json(
            jsonResponse(400,{
                error: "usuario no encontrado",
            })
        );
        }
    });

module.exports = router;