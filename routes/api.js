"use strict";

const Issue = require("../issue.js")();

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .post(async function (req, res) {
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
      } else {
        const open = true;
        const created_on = new Date();
        const updated_on = new Date();
        const { _id } = await Issue.create({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open,
          created_on,
          updated_on,
        });
        const issue = await Issue.findById(_id).select({
          project: 0,
          __v: 0,
        });
        res.json(issue);
      }
    })

    .get(async function (req, res) {
      const project = req.params.project;
      const issues = await Issue.find({
        project,
      })
        .find(req.query)
        .select({
          project: 0,
          __v: 0,
        });
      res.json(issues);
    })

    .put(async function (req, res) {
      if (Object.keys(req.body).length == 1) {
        res.json({ error: "no update field(s) sent", _id: req.body._id });
        return;
      }
      let { _id, ...update } = req.body;
      if (!_id) {
        res.json({ error: "missing _id" });
      } else if (!(await Issue.findById(_id))) {
        res.json({ error: "could not update", _id: _id });
      } else {
        try {
          //   Credits: https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
          update = Object.fromEntries(
            Object.entries(update).filter(([_, v]) => v != "")
          );
          console.log("in here");
          console.log(update);
          await Issue.findOneAndUpdate({ _id }, update);
          res.json({ result: "successfully updated", _id: _id });
        } catch {
          res.json({ error: "could not update", _id: _id });
        }
      }
    })

    .delete(async function (req, res) {
      const { _id } = req.body;
      if (!_id) {
        res.json({ error: "missing _id" });
      } else if (!(await Issue.findById(_id))) {
        res.json({ error: "could not delete", _id: _id });
      } else {
        await Issue.deleteOne({ _id });
        res.json({ result: "successfully deleted", _id: _id });
      }
    });
};
