module.exports = function () {
  const mongoose = require("mongoose");
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // { issue_title, issue_text, created_by, assigned_to, status_text
  const issueSchema = new mongoose.Schema({
    project: {
      type: String,
      required: true,
    },
    issue_title: {
      type: String,
      required: true,
    },
    issue_text: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
      required: true,
    },
    assigned_to: String,
    favoriteFoods: String,
    open: Boolean,
    created_on: Date,
    updated_on: Date,
  });

  const Issue = mongoose.model("Issue", issueSchema);

  return Issue;
};
