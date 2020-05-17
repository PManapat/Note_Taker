const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

let notesData = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Develop/public")));

//Get
app.get("/api/notes", function (err, res) {
  try {
    notesData = fs.readFileSync("Develop/db/db.json");

    notesData = JSON.parse(notesData);

  } catch (err) {
    console.log(err);
  }
  res.json(notesData);
});

//Post
app.post("/api/notes", function (req, res) {
  try {
    notesData = fs.readFileSync("./Develop/db/db.json");

    notesData = JSON.parse(notesData);
    req.body.id = notesData.length;
    notesData.push(req.body);
    notesData = JSON.stringify(notesData);

    fs.writeFile("./Develop/db/db.json", notesData, function (err) {
      if (err) throw err;
    });
    res.json(JSON.parse(notesData));

  } catch (err) {
    throw err;
  }
});

//Delete
app.delete("/api/notes/:id", function (req, res) {
  try {
    notesData = fs.readFileSync("./Develop/db/db.json");
    notesData = JSON.parse(notesData);
    notesData = notesData.filter(function (note) {
      return note.id != req.params.id;
    });
    notesData = JSON.stringify(notesData);

    fs.writeFile("./Develop/db/db.json", notesData, function (err) {
      if (err) throw err;
    });

    res.send(JSON.parse(notesData));

  } catch (err) {
    throw err;
  }
});


//Basic Routes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});
app.get("/api/notes", function (req, res) {
  return res.sendFile(path.json(__dirname, "./Develop/db/db.json"));
});

//Listener
app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});