let chai = require("chai");
let server = require("../index");
const chaiHttp = require("chai-http");

//Assertion Style
const expect = chai.expect;

chai.use(chaiHttp);

describe("Shifts APIs", () => {   

    describe("Check Shift for User", () => {
        it("should return recent shift operation for user", (done) => {
          chai
            .request(server)
            .get("/api/core/checkShiftForUser?outletDate=2023-10-08&userId=5&userType=4")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error").to.be.null;
              expect(res.body).to.have.property("Details");
            //   expect(res.body.Details)
            //     .to.be.an("array");
              done();
            });
        });
        it("should return user cannot access the shift", (done) => {
          chai
            .request(server)
            .get("/api/core/checkShiftForUser?outletDate=2023-10-08&userId=12&userType=5")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10029);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This User Cannot access shift operations");
              done();
            });
        });
        it("should return user does not exist", (done) => {
          chai
            .request(server)
            .get("/api/core/checkShiftForUser?outletDate=2023-10-08&userId=13&userType=4")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10010);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("User Does not exist");
              done();
            });
        });
        it("should return outlet is not opened", (done) => {
          chai
            .request(server)
            .get("/api/core/checkShiftForUser?outletDate=2023-10-08&userId=12&userType=2")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10028);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This Outlet is not open");
              done();
            });
        });
      });
    describe("Check Recent Shift for Outlet", () => {
        it("should return recent shift for outlet", (done) => {
          chai
            .request(server)
            .get("/api/core/recentShiftForOutlet?outletDate=2023-10-08")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error").to.be.null;
              expect(res.body).to.have.property("Details");
              expect(res.body.Details)
                .to.be.an("array");
              done();
            });
        });
      });
    describe("Open Shift", () => {
        it("should open a new shift", (done) => {
            const newShift = {
                outletDate: "2023-10-08",
                shiftTypeId: 1,
                userType: 1,
                userId: 1,
                openTime: "11:17"
            }
          chai
            .request(server)
            .post("/api/core/openShift")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newShift)
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
        it("should return user cannot access the shift", (done) => {
            const newShift = {
                outletDate: "2023-10-08",
                shiftTypeId: 1,
                userType: 5,
                userId: 12,
                openTime: "11:17"
            }
    
          chai
            .request(server)
            .post("/api/core/openShift")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newShift)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10029);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This User Cannot access shift operations");
              done();
            });
        });
        it("should return user does not exist", (done) => {
            const newShift = {
                outletDate: "2023-10-08",
                shiftTypeId: 1,
                userType: 4,
                userId: 13,
                openTime: "11:17"
            }
    
          chai
            .request(server)
            .post("/api/core/openShift")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newShift)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10010);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("User Does not exist");
              done();
            });
        });
        it("should return outlet is not opened", (done) => {
            const newShift = {
                outletDate: "2023-10-08",
                shiftTypeId: 1,
                userType: 2,
                userId: 12,
                openTime: "11:17"
            }
    
          chai
            .request(server)
            .post("/api/core/openShift")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newShift)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10028);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This Outlet is not open");
              done();
            });
        });
    });
    describe("Close Shift", () => {
        it("should close the shift", (done) => {
            const newShift = {
                outletId: 87,
                shiftId: 1,
                closeTime: "11:20",
                userTypeId: 1,
                userId: 1
            }
          chai
            .request(server)
            .post("/api/core/closeShift")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newShift)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error").to.be.null
              expect(res.body)
                .to.have.property("Details")
                .to.be.an("array");
              done();
            });
        });
        
    });

    describe("Reopen Shift", () => {
        it("should reopen the shift", (done) => {
            const newShift = {
                userId:1,
                outletId: 87,
                shiftId: 1,
                userTypeId: 1,
                reopenTime: "11:30"
            }
          chai
            .request(server)
            .post("/api/core/reopenShift")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newShift)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error").to.be.null
              expect(res.body)
                .to.have.property("Details")
                .to.be.an("array");
              done();
            });
        });
  
    });
  });