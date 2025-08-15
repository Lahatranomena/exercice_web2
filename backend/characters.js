const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "charactersData.json");


router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data.characters);
});

router.post("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const { id, ...rest } = req.body;

  if (!id) {
    return res.status(400).json({ error: "An ID must be provided" });
  }

  const exists = data.characters.some(c => c.id == id);
  if (exists) {
    return res.status(400).json({ error: "This ID already exists" });
  }

  const newCharacter = { id, ...rest };
  data.characters.push(newCharacter);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.status(201).json(newCharacter);
});



router.put("/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const index = data.characters.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Character not found" });
  data.characters[index] = { ...data.characters[index], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json(data.characters[index]);
});


router.delete("/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const index = data.characters.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Character not found" });
  const deleted = data.characters.splice(index, 1);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json(deleted[0]);
});

module.exports = router;
