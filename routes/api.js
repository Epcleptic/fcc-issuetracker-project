"use strict";

const Issue = require("../issue.js")();

module.exports = function (app) {
  app
    .route("/api/issues/:project")

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

    .post(async function (req, res) {
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by) {
        res.sendStatus(400);
      } else {
        const open = true;
        const created_on = new Date();
        const updated_on = new Date();
        await Issue.create({
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
        res.sendStatus(200);
      }
    })

    .put(async function (req, res) {
      let { _id, ...update } = req.body;
      if (!_id || !(await Issue.findById(_id))) {
        res.sendStatus(400);
        return;
      }

      //   Credits: https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
      update = Object.fromEntries(
        Object.entries(update).filter(([_, v]) => v != "")
      );

      await Issue.findOneAndUpdate({ _id }, update);
      res.sendStatus(200);
    })

    .delete(async function (req, res) {
      const { _id } = req.body;
      if (!_id || !(await Issue.findById(_id))) {
        res.sendStatus(400);
        return;
      }

      await Issue.deleteOne({ _id });
      res.sendStatus(200);
    });
};
