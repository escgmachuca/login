const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authenticateToken = require("./auth/authenticateToken");
const log = require("./lib/trace")
require ("dotenv").config();

const port = process.env.PORT || 3100;

app.use(cors());
app.use(express.json());

async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Connected to MongoDB");
}
main().catch(console.error);

app.use("/api/registrarse", require("./Rutas/registrarse"));
app.use("/api/deslogearse", require("./Rutas/deslogearse"));
app.use("/api/logear", require("./Rutas/logear"));
app.use("/api/user", authenticateToken, require("./Rutas/user"));
app.use("/api/todos", authenticateToken, require("./Rutas/todos"));
app.use("/api/refresh-token", require("./Rutas/refreshToken"));
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);

});

module.exports = app;