// test/app.integration.spec.js
const request = require("supertest");
const app = require("../app");
const connection = require("../connection");

// describe("Test routes", () => {
//   beforeEach((done) => connection.query("TRUNCATE bookmark", done));

//   it('GET / sends "Hello World" as json', (done) => {
//     request(app)
//       .get("/")
//       .expect(200)
//       .expect("Content-Type", /json/)
//       .then((response) => {
//         const expected = { message: "Hello World!" };
//         expect(response.body).toEqual(expected);
//         done();
//       });
//   });
// });

// describe("Test fail post", () => {
//   beforeEach((done) => {
//     connection.query("TRUNCATE bookmark", () => {
//       done();
//     });
//   });
//   it("POST /bookmarks sends error as json", (done) => {
//     request(app)
//       .post("/bookmarks")
//       .send({})
//       .expect(422)
//       .expect("Content-Type", /json/)
//       .then((response) => {
//         const expected = { error: "required field(s) missing" };
//         expect(response.body).toEqual(expected);
//         done();
//       });
//   });
// });
// it("POST /bookmarks sends bookmark as json", (done) => {
//   request(app)
//     .post("/bookmarks")
//     .send({ url: "https://jestjs.io", title: "Jest" })
//     .expect(201)
//     .expect("Content-Type", /json/)
//     .then((response) => {
//       const expected = {
//         id: expect.any(Number),
//         url: "https://jestjs.io",
//         title: "Jest",
//       };
//       expect(response.body).toEqual(expected);
//       done();
//     });
// });

describe("GET /bookmarks/:id", () => {
  const testBookmark = { url: "https://nodejs.org/", title: "Node.js" };
  beforeEach(() => {
    return connection
      .query("TRUNCATE bookmark")
      .then(() => connection.query("INSERT INTO bookmark SET ?", testBookmark));
  });

  // Write your tests HERE!
  it("GET /bookmarks/:id sends error as json", (done) => {
    request(app)
      .get("/bookmarks/6")
      .expect(404)
      .expect("Content-Type", /json/)
      .then((response) => {
        const expected = { error: "Bookmark not found" };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it("GET /bookmarks/:id succes", (done) => {
    request(app)
      .get("/bookmarks/1")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        const expected = {
          id: expect.any(Number),
          url: "https://nodejs.org/",
          title: "Node.js",
        };
        expect(response.body).toEqual(expected);
        done();
      });
  });
});
