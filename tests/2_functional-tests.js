const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const issue = require("../issue");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest")
      .send({
        issue_title: "Testing 123",
        issue_text: "Text",
        created_by: "Person",
        assigned_to: "Other person",
        status_text: "Open",
      })
      .end(function (err, res) {
        assert.equal(res.body.issue_title, "Testing 123");
        done();
      });
  });
  test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest")
      .send({
        issue_title: "Testing 1234",
        issue_text: "Text",
        created_by: "Person",
      })
      .end(function (err, res) {
        assert.equal(res.body.issue_title, "Testing 1234");
        done();
      });
  });
  test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest")
      .send({
        issue_title: "Title",
        issue_text: "Text",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });
  test("View issues on a project: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        const issue = res.body[1];
        assert.equal(issue.issue_title, "title");
        assert.equal(issue.issue_text, "text");
        assert.equal(issue.created_by, "created");
        assert.equal(issue.assigned_to, "assigned");
        assert.equal(issue.open, true);
        assert.equal(issue.created_on, "2025-08-13T15:31:26.282Z");
        assert.equal(issue.updated_on, "2025-08-13T15:31:26.282Z");
        done();
      });
  });
  test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest?issue_title=title_1")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        const issue = res.body[0];
        assert.equal(issue.issue_title, "title_1");
        assert.equal(issue.issue_text, "text");
        assert.equal(issue.created_by, "created");
        assert.equal(issue.assigned_to, "");
        assert.equal(issue.open, true);
        assert.equal(issue.created_on, "2025-08-13T16:36:52.892Z");
        assert.equal(issue.updated_on, "2025-08-13T16:36:52.892Z");
        done();
      });
  });
  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest?issue_title=title_1&issue_text=text_1")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        const issue = res.body[0];
        assert.equal(issue.issue_title, "title_1");
        assert.equal(issue.issue_text, "text_1");
        assert.equal(issue.created_by, "created");
        assert.equal(issue.assigned_to, "");
        assert.equal(issue.open, true);
        assert.equal(issue.created_on, "2025-08-13T16:37:09.835Z");
        assert.equal(issue.updated_on, "2025-08-13T16:37:09.835Z");
        done();
      });
  });
  test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        _id: "689cb071a9364c27d0e28dec",
        issue_title: "Updated title",
      })
      .end(function (err, res) {
        assert.equal(res.body.result, "successfully updated");
        done();
      });
  });
  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        _id: "689cb071a9364c27d0e28dec",
        issue_title: "Updated title",
        open: false,
      })
      .end(function (err, res) {
        assert.equal(res.body.result, "successfully updated");
        done();
      });
  });
  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        issue_title: "Updated title",
        open: false,
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        _id: "689cb071a9364c27d0e28dec",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "no update field(s) sent");
        done();
      });
  });
  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        _id: "689cb071a9364c27d0e28ded",
        issue_title: "Updated title",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "could not update");
        done();
      });
  });
  test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest")
      .send({
        issue_title: "Title",
        issue_text: "Text",
        created_by: "Person",
      })
      .end(function (err, res) {});
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest")
      .end(function (err, res) {
        let idToDelete = res.body[res.body.length - 1]._id;
        chai
          .request(server)
          .keepOpen()
          .delete("/api/issues/apitest")
          .send({
            _id: idToDelete,
          })
          .end(function (err, res) {
            assert.equal(res.body.result, "successfully deleted");
          });
        done();
      });
  });
  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest")
      .send({
        _id: "689cb01a32f8ce673cf357dc",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "could not delete");
        done();
      });
  });
  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest")
      .send({})
      .end(function (err, res) {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
