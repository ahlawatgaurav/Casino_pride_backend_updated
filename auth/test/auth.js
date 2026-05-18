let chai = require("chai");
let server = require("../index");
const chaiHttp = require("chai-http");

//Assertion Style
const expect = chai.expect;

chai.use(chaiHttp);

describe("Authenticate User", () => {
  describe("Validate User", () => {   

    it("should validate a user", (done) => {
        const newUser = {
            Username: "simmiepp",
            Password: "simmieee"
           
          }
      chai
        .request(server)
        .post("/api/auth/validateuser")
        .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("Error").to.be.null
          expect(res.body)
            .to.have.property("Details")
            .to.be.an("object");
          done();
        });
    });
    it("should return user does not exist", (done) => {
        const newUser = {
            Username: "simmieppoo",
            Password: "simmieee"
           
          }

      chai
        .request(server)
        .post("/api/auth/validateuser")
        .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("Error");
          expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10005);
          expect(res.body.Error)
            .to.have.property("ErrorMessage")
            .to.be.eq("User Does Not Exist");
          done();
        });
    });
    it("should return user inactive", (done) => {
        const newUser = {
            Username: "simmiepp",
            Password: "simmieee"
           
          }

      chai
        .request(server)
        .post("/api/auth/validateuser")
        .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("Error");
          expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10006);
          expect(res.body.Error)
            .to.have.property("ErrorMessage")
            .to.be.eq("User Inactive");
          done();
        });
    });
    // it("should return invalid user", (done) => {
    //     const newUser = {
    //         Username: "simmieppooo",
    //         Password: "simmieee"
           
    //       }

    //   chai
    //     .request(server)
    //     .post("/api/auth/validateuser")
    //     .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
    //     .set(
    //       "AuthToken",
    //       `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
    //     )
    //     .send(newUser)
    //     .end((err, res) => {
    //       expect(err).to.be.null;
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.be.an("object");
    //       expect(res.body).to.have.property("Error");
    //       expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10004);
    //       expect(res.body.Error)
    //         .to.have.property("ErrorMessage")
    //         .to.be.eq("Invalid User");
    //       done();
    //     });
    // });
});

describe("Login User", () => {   

    it("should login a user", (done) => {
        const newUser = {
            UserId: 12,
            UserType: 2
        }
      chai
        .request(server)
        .post("/api/auth/login")
        .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
        // .set(
        //   "AuthToken",
        //   `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
        // )
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("Error").to.be.null
          expect(res.body)
            .to.have.property("Details")
            .to.be.an("object");
          done();
        });
    });
});
describe("Logout a user", () => {
    it("should logout a user", (done) => {
        const newUser = {
            UserId: 12
        }
      chai
        .request(server)
        .post("/api/auth/logout")
        .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
        .set(
          "AuthToken",
          `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiU3VuIE9jdCAwOCAyMDIzIDE1OjI5OjM2IEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MTIsImlhdCI6MTY5Njc1OTE3Nn0.TzUL9AjbEKK5V_JF6DD7Mgbh8h8XoJTTnL0ql1c7hBY`
        )
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("Error").to.be.null
          expect(res.body)
            .to.have.property("Details")
            .to.be.an("object");
          done();
        });
    });
});
describe("Check IP", () => {
    it("should check IP", (done) => {
        
      chai
        .request(server)
        .get("/api/auth/checkIP")
        .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
        .set(
          "AuthToken",
          `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
        )           
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("Error").to.be.null
          expect(res.body)
            .to.have.property("Details")
            .to.be.an("object");
          done();
        });
    });
});
 })

