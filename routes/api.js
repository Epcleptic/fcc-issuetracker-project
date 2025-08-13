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
      let { issue_title, issue_text, created_by, assigned_to, status_text } =
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

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
