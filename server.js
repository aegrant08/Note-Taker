// Server
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
//=============================================================
const app = express();
const PORT = process.env.PORT || 3000;
const mainDir = path.join(__dirname, "/public");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Set up notes
fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    //API routes
    app.get("/api/notes", function (req, res) {
        //Function to read the db.json file and return any saved notes as JSON
        res.json(notes);
    });
    // /api/notes post
    app.post("/api/notes", function (req, res) {
        let newNote = req.body;
        notes.push(newNote);
        updateNoteDb();
        return console.log("Added " + newNote.title);
    });
    // Retrieves note based on id
    app.get("/api/notes/:id", function (req, res) {
        let savedNotes = JSON.parse(fs.readFileSync("db/db.json"))
        res.json(savedNotes[Number(req.params.id)]);
    });
    // Deletes note based on id
    app.delete("/api/notes/:id", function (req, res) {
        notes.splice(req.params.id, 1);
        updateNoteDb();
        console.log("Deleted note with id " + req.params.id);
    });
    // calls the note html file
    app.get("/notes", function (req, res) {
        res.sendFile(path.join(mainDir, "notes.html"));
    });
    // calls the index html file
    app.get("*", function (req, res) {
        res.sendFile(path.join(mainDir, "index.html"));
    });

    // function that updates the json file with new note or deleted note
    function updateNoteDb() {
        fs.writeFile("db/db.json", JSON.stringify(notes, "\t"), err => {
            if (err) throw err
            return true;
        });
    }
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT + " Don't forget to turn the PORT off!");
});