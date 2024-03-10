const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require ("../schema/user");


router.post("/", async function (req, res, next) {
    const {username, name , dni , password} = req.body;

    if(!username || !name || !dni || !password){
        return res.status(409).json(jsonResponse(409, {
            error: "Campos requeridos",
        })
        );
    }
    //crear usuario en la base de datos
    //const user = new User ({ username, name, dni, password });
    try {
        const user = new User();
        const userExists = await user.usernameExist(username);
        
        if(userExists){
            return res.status(409).json(
                jsonResponse(409, {
                    error: "El usuario ya existe"
                 })
            );
        } else {
        const User = new User({ username, name, dni, password })
        await user.save();
        
        res.json(jsonResponse(200,{message: "Usuario creado",
        })
        );
     }
    } catch(err) {
        res.status(500).json(jsonResponse(500, {
            error: "Error Creando Usuario",
        })
        );
    }
    
});

module.exports = router;