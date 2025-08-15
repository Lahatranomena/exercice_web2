const express = require("express");
const app = express();
const charactersRoute = require("./characters");
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3001" }));


app.use(express.json());

app.use("/characters", charactersRoute);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
