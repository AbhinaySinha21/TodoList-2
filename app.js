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



app.get("/", function (req, res) {

  item.find((err, items) => {
      res.render("list", { listTitle: "ToDo-List", newListItems: items });
  });

});

app.post("/", function (req, res) {
  let v=req.body.newItem;
  if(v.length==0)
      res.redirect("/");
  else{
  const newi = new item({ name: req.body.newItem });
  const listN = req.body.list;
  if (listN === "ToDo-List") {
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
}
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const nameL = req.body.listName;
  if (nameL === "Today") {
    item.findByIdAndRemove(checkedItemId, (err) => {
      if (err)
        console.log(err);

    });
    res.redirect("/");
  } else {

    List.findOneAndUpdate({ name: nameL }, { $pull: { itemCollection: { _id: checkedItemId } } }, function (err, found) {
      if (!err)
        res.redirect("/" + nameL);
    });
  }

});

app.get("/:types", function (req, res) {
  const customNames = _.capitalize(req.params.types);

  List.findOne({ name: customNames }, function (err, found) {
    if (!err) {
      if (!found) {
        const list = new List({
          name: customNames
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
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3500;
}
app.listen(port, function () {
  console.log("Server started on port 3500");
});
