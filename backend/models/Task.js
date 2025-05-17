const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  subject: String,
  progress: String,
  deadline: String,
  priority: String,
  status: String,
});

module.exports = mongoose.model("Task", taskSchema);