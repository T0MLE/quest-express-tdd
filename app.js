// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require("./connection");


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const getAll = (req, res) => {
    res.status(200).json({"message" : "Hello World!"})
}

const insert = (bookmark) => {
    const { url, title } = bookmark;
    return db.execute(
      `insert into bookmark (url, title) values (?, ?)`,
      [url, title]
    );
  };

  const post = async (req, res) => {
    const { url, title } = req.body;
    if (!url || !title) {
      res.status(422).send({error: "required field(s) missing"});
      return;
    }
    try {
        const result = await insert({ url, title });
        res
          .status(201)
          .json({ id: result.insertId, url, title });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      }
    };


    const findById = (id) => {
        return db
          .query(
            "SELECT * FROM bookmark WHERE id = ? ",
            [id]
          )
          .then(([data]) => {
            return data;
          });
      };

    const getById = (req, res) => {
        const { id } = req.params;
        findById(id)
          .then(([bookmark]) => {
            !bookmark
              ? res.status(404).json({ error: 'Bookmark not found' })
              : res.status(200).json(bookmark);
          })
          .catch((err) => console.error(err));
      };


app.get("/", getAll )
app.get("/bookmarks/:id", getById)
app.post("/bookmarks", post)

module.exports = app;
