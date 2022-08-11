//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Abhinay_Sinha:Abhinay123@cluster0.2tevqxz.mongodb.net/todolistDB");

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
const item = mongoose.model("item", itemSchema);

const listSchema = mongoose.Schema({
  name: String,
  itemCollection: [itemSchema]
});

const List = mongoose.model("List", listSchema);

const item1 = new item({
  name: "cook"
});
const item2 = new item({
  name: "Work"
});
const item3 = new item({
  name: "Personal"
});

const defaultItem = [item1, item2, item3];



app.get("/", function (req, res) {

  item.find((err, items) => {
    if (items.length === 0) {
      item.insertMany(defaultItem, (err) => {
        if (err)
          console.log(err);
        else
          console.log("Success");
      });
      res.redirect("/");
    }
    else {
      res.render("list", { listTitle: "Today", newListItems: items });
    }
  });

});

app.post("/", function (req, res) {

  const newi = new item({ name: req.body.newItem });
  const listN = req.body.list;
  if (listN === "Today") {
    newi.save();
    res.redirect("/");
  }
  else {
    List.findOne({ name: listN }, function (err, found) {
      found.itemCollection.push(newi);
      found.save();
      res.redirect("/" + listN);
    })
  }
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const nameL = req.body.listName;
  if (nameL === "Today") {
    item.findByIdAndRemove(checkedItemId, (err) => {
      if (err)
        console.log(err);
      else
        console.log("Deleted");

    });
    res.redirect("/");
  }
  List.findOneAndUpdate({ name: nameL }, { $pull: { itemCollection: { _id: checkedItemId } } }, function (err, found) {
    if (!err)
      res.redirect("/" + nameL);
  });

});

app.get("/:types", function (req, res) {
  const customNames = _.capitalize(req.params.types);

  List.findOne({ name: customNames }, function (err, found) {
    if (!err) {
      if (!found) {
        const list = new List({
          name: customNames,
          itemCollection: defaultItem
        });

        list.save();
        res.redirect("/" + customNames);
      } else {
        res.render("list", { listTitle: customNames, newListItems: found.itemCollection })
      }
    }
  })

})

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(process.env.PORT, function () {
  console.log("Server started on port 3500");
});
