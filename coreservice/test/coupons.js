let chai = require("chai");
let server = require("../index");
const chaiHttp = require("chai-http");

//Assertion Style
const expect = chai.expect;

chai.use(chaiHttp);

describe("Coupon APIs", () => {   
    describe("Get All Coupons", () => {
      it("should get all Coupons", (done) => {
        chai
          .request(server)
          .get("/api/core/coupon")
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
            //   .to.have.lengthOf.at.least(1);
            done();
          });
      });
    });
    describe("Delete Coupon", () => {
      it("should delete a coupon", (done) => {
        chai
          .request(server)
          .delete("/api/core/coupon?couponId=6")
          .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
          .set(
            "AuthToken",
            `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
          )
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body)
              .to.have.property("Details")
            expect(res.body).to.have.property("Error").to.be.null;
            done();
          });
      });
  
      it("should be invalid id", (done) => {
        chai
          .request(server)
          .delete("/api/core/coupon?couponId=9")
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
            expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10015);
            expect(res.body.Error)
              .to.have.property("ErrorMessage")
              .to.be.eq("Invalid Coupon Id");
            done();
          });
      });
    });
    describe("Get Coupon By Initial", () => {
      it("should get a coupon by initial", (done) => {
        chai
          .request(server)
          .get("/api/core/couponByInitial?initial=CHR&numeric=0060&currentDate=2023-12-30")
          .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
          .set(
            "AuthToken",
            `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
          )
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body)
              .to.have.property("Details")
            expect(res.body).to.have.property("Error").to.be.null;
            done();
          });
      });
      it("should be no coupon", (done) => {
        chai
          .request(server)
          .get("/api/core/couponByInitial?initial=CHRIO&numeric=0061&currentDate=2023-12-30")
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
            expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10016);
            expect(res.body.Error)
              .to.have.property("ErrorMessage")
              .to.be.eq("Coupon Does not exist");
            done();
          });
      });
      it("should be inactive coupon", (done) => {
        chai
          .request(server)
          .get("/api/core/couponByInitial?initial=DRER&numeric=0002&currentDate=2023-09-16")
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
            expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10023);
            expect(res.body.Error)
              .to.have.property("ErrorMessage")
              .to.be.eq("Coupon is Inactive");
            done();
          });
      });
      it("should be expired coupon", (done) => {
        chai
          .request(server)
          .get("/api/core/couponByInitial?initial=CHR&numeric=0060&currentDate=2023-12-31")
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
            expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10024);
            expect(res.body.Error)
              .to.have.property("ErrorMessage")
              .to.be.eq("Coupon has expired");
            done();
          });
      });
    });
    describe("Add Coupon", () => {
      it("should add a new coupon", (done) => {
        const newCoupon = {
          couponTitle: "Diwali Special Special",
          couponDiscount: 10,
          initial: "DDLJ",
          seriesStart: "0001",
          seriesEnd: "0100",
          startDate: "2023-10-01",
          endDate: "2023-10-30",
          totalCoupons: 100,
          usedCoupons: "[]",
          remainingCoupons: 100,
          isCouponEnabled: 1,
          isActive: 1,
        };
  
        chai
          .request(server)
          .post("/api/core/coupon")
          .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
          .set(
            "AuthToken",
            `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
          )
          .send(newCoupon)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("Error").to.be.null
            expect(res.body)
              .to.have.property("Details")
              .to.be.an("object");
            //   .to.eq("Billing Engineer Added Successfully");
            done();
          });
      });
      it("shoold be coupon exists", (done) => {
        const newCoupon = {
          couponTitle: "Diwali Special Special",
          couponDiscount: 10,
          initial: "DDLJ",
          seriesStart: "0001",
          seriesEnd: "0100",
          startDate: "2023-10-01",
          endDate: "2023-10-30",
          totalCoupons: 100,
          usedCoupons: "[]",
          remainingCoupons: 100,
          isCouponEnabled: 1,
          isActive: 1,
        };
  
        chai
          .request(server)
          .post("/api/core/coupon")
          .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
          .set(
            "AuthToken",
            `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
          )
          .send(newCoupon)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("Error");
            expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10017);
            expect(res.body.Error)
              .to.have.property("ErrorMessage")
              .to.be.eq("This Coupon already exists");
            done();
          });
      });
    });
   describe("Update/Edit Coupon", () => {
      it("should update or edit a coupon", (done) => {
        const updateCoupon = {
          couponId:12,
          couponRef:"0b1b1859-647b-11ee-9b16-9227c8d1a2ef",
          couponTitle: "Diwali Special Special",
          couponDiscount: 10,
          initial: "DDLJ",
          seriesStart: "0001",
          seriesEnd: "0100",
          startDate: "2023-10-01",
          endDate: "2023-10-30",
          totalCoupons: 100,
          usedCoupons: "[DDLJ007]",
          remainingCoupons: 99,
          isCouponEnabled: 1,
          isActive: 1,
        };
  
        chai
          .request(server)
          .put("/api/core/coupon")
          .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
          .set(
            "AuthToken",
            `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
          )
          .send(updateCoupon)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body)
              .to.have.property("Details")
              // .to.eq("Billing Engineer Updated Successfully");
            done();
          });
      });
      it("shoold be no coupon", (done) => {
        const updateCoupon = {
          couponId:12,
          couponRef:"ab5b9447-647a-11ee-9b16-9227c8d1a2oo",
          couponTitle: "Diwali Special Special",
          couponDiscount: 10,
          initial: "DDLJ",
          seriesStart: "0001",
          seriesEnd: "0100",
          startDate: "2023-10-01",
          endDate: "2023-10-30",
          totalCoupons: 100,
          usedCoupons: "[DDLJ007]",
          remainingCoupons: 99,
          isCouponEnabled: 1,
          isActive: 1,
        };
  
        chai
          .request(server)
          .put("/api/core/coupon")
          .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
          .set(
            "AuthToken",
            `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
          )
          .send(updateCoupon)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("Error");
            expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10016);
            expect(res.body.Error)
              .to.have.property("ErrorMessage")
              .to.be.eq("Coupon Does not exist");
            done();
          });
      });
    });
   describe("Update Used Coupon", () => {
      it("should update a used coupon", (done) => {
        const updateCoupon = {
          couponId:12,
          usedCoupons:"[DDLJ007,DDLJ008]",
          remainingCoupons:98
        };
  
        chai
          .request(server)
          .patch("/api/core/usedCoupon")
          .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
          .set(
            "AuthToken",
            `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
          )
          .send(updateCoupon)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body)
              .to.have.property("Details")
              // .to.eq("Billing Engineer Updated Successfully");
            done();
          });
      });
      it("shoold be no coupon", (done) => {
        const updateCoupon = {
          couponId:13,
          usedCoupons:"[DDLJ007,DDLJ008]",
          remainingCoupons:98
        };
  
        chai
          .request(server)
          .patch("/api/core/usedCoupon")
          .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
          .set(
            "AuthToken",
            `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
          )
          .send(updateCoupon)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("Error");
            expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10016);
            expect(res.body.Error)
              .to.have.property("ErrorMessage")
              .to.be.eq("Coupon Does not exist");
            done();
          });
      });
    });
  });