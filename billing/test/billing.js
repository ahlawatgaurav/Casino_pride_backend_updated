let chai = require("chai");
let server = require("../index");
const chaiHttp = require("chai-http");

//Assertion Style
const expect = chai.expect;

chai.use(chaiHttp);

describe("Billing API's", () => {   
    describe("Add Billing Details", () => {
        it("should add a new booking", (done) => {
            const newBilling = {
                bookingId: 82,
                packageId: "[1]",
                packageGuestCount: "[4]",
                totalGuestCount: 5,
                teensCount:1,
                bookingDate : "2023-10-09",
                billingDate:"2023-10-09"            
            }
          chai
            .request(server)
            .post("/api/billing/addBillingDetails")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBilling)
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
        it("should return booking does not exist", (done) => {
            const newBilling = {
                bookingId: 100,
                packageId: "[1]",
                packageGuestCount: "[4]",
                totalGuestCount: 5,
                teensCount:1,
                bookingDate : "2023-10-09",
                billingDate:"2023-10-09"            
            }
          chai
            .request(server)
            .post("/api/billing/addBillingDetails")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBilling)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10009);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This Booking does not exist");
              done();
            });
        });
 
    });
    describe("Get Billing Details", () => {
        it("should get all billing details", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails")
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
        it("should return billing details by Bill Id", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails?billId=141")
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
        it("should return invalid bill Id", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails?billId=3000")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10010);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This Bill does not exist");
              done();
            });
        });
        it("should return billing details by User Id", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails?userId=1")
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
        it("should return invalid user Id", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails?userId=100")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10013);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("There is no booking for this User");
              done();
            });
        });
        it("should return billing details by shift and date", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails?billingDate=2023-10-08&shiftId=2")
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
        it("should return invalid shift and date", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails?billingDate=2022-09-08&shiftId=2")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10012);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("There is no booking for the given shift and date");
              done();
            });
        });
        it("should return billing details by date", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails?billingDate=2023-10-08")
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
        it("should return bill for date does not exist", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails?billingDate=2023-06-10")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10011);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("Bill for this date does not exist");
              done();
            });
        });
        it("should return billing details using all the filters", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails?billId=206&userId=1&shiftId=2&billingDate=2023-10-08")
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
        it("should return bill does not exist ", (done) => {
          chai
            .request(server)
            .get("/api/billing/getBillingDetails?billId=206&userId=7&shiftId=2&billingDate=2023-10-08")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10010);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This Bill does not exist");
              done();
            });
        });

      });

     describe("Update Billing Details", () => {
        it("should update bill details", (done) => {
            const newBilling = {
                bookingId: 1,           
            }
          chai
            .request(server)
            .put("/api/billing/updateBillingDetails")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBilling)
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
        it("should return booking does not exist", (done) => {
            const newBilling = {
                bookingId: 100,           
            }
          chai
            .request(server)
            .put("/api/billing/updateBillingDetails")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBilling)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10009);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This Booking does not exist");
              done();
            });
        });
 
    });
     describe("Void Bill", () => {
        it("should void/cancel bill", (done) => {
            const newBilling = {
                bookingId: 1,           
            }
          chai
            .request(server)
            .put("/api/billing/voidBill")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBilling)
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
        it("should return booking does not exist", (done) => {
            const newBilling = {
                bookingId: 100,           
            }
          chai
            .request(server)
            .put("/api/billing/voidBill")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBilling)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10009);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This Booking does not exist");
              done();
            });
        });
    });
     describe("Update BillId For Void", () => {
        it("should update bill Id for void/cancelled bill", (done) => {
            const newBilling = {
                voidBillId: 2,           
                bookingId: 1,           
                newBillId: 13,           
            }
          chai
            .request(server)
            .put("/api/billing/updateBillIdForVoid")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBilling)
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
        it("should return bill does not exist", (done) => {
            const newBilling = {
              voidBillId: 1,           
              bookingId: 100,           
              newBillId: 13,            
            }
          chai
            .request(server)
            .put("/api/billing/updateBillIdForVoid")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBilling)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10010);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This Bill does not exist");
              done();
            });
        });
    });
    describe("Fetch No Show Guest List", () => {
      it("should get the list of guest that did not show", (done) => {
        chai
          .request(server)
          .get("/api/billing/noShowGuestList")
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
    describe("Fetch Void bill List", () => {
      it("should get the list of bills that are cancelled/void", (done) => {
        chai
          .request(server)
          .get("/api/billing/fetchVoidBill")
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
  });