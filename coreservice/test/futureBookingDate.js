let chai = require("chai");
let server = require("../index");
const chaiHttp = require("chai-http");

//Assertion Style
const expect = chai.expect;

chai.use(chaiHttp);

describe("Future Booking Dates APIs", () => {   
    describe("Add/Update Future Booking Date", () => {
        it("should add/update future booking date", (done) => {
            const futureBookingDate = {
                futureDateId: 1,
                startDate: "2023-10-08",
                endDate: "2023-10-10"
            
            }
          chai
            .request(server)
            .post("/api/core/futureBookingDate")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(futureBookingDate)
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
    describe("Fetch Future Booking Date", () => {
        it("should get all discounts for website", (done) => {
          chai
            .request(server)
            .get("/api/core/futureBookingDate")
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
                .to.be.an("object");
              done();
            });
        });
      });
  });