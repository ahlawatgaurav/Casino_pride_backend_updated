let chai = require("chai");
let server = require("../index");
const chaiHttp = require("chai-http");

//Assertion Style
const expect = chai.expect;

chai.use(chaiHttp);

describe("Booking API's", () => {   
    describe("New Booking", () => {
        it("should add a new booking", (done) => {
            const newBooking = {
                guestName:"Lee Junho",
                address:"Ponda",
                phone:"8687891100",
                email:"leejunho@mail.com",
                dob:"25-01-1996",
                country:"Indiaaa",
                state:"Goaaa",
                city:"Ponda",
                // GSTNumber:"gty77889989",
                // governmentId:"gty77889989",
                totalGuestCount:5,
                // numOfKids:0,
                numOfTeens:1,
                // discountId:2,
                // panelDiscountId:1,
                couponId:0,
                // referredBy:"testUser",
                settledByCompany:0,
                packageId:"[1]",
                packageName:"['Testing OTP']",
                packageGuestCount:"[4]",
                userId:1,
                userTypeId:1,
                // futureDate:"2023-10-25",
                shiftId:1,
                teensPrice:1000,
                teensRate:847.558,
                teensTax:18,
                teensTaxName:"GST",
                actualAmount:6000,
                amountAfterDiscount:6000,
                paymentMode:"Cash",
                // partCash:"2000",
                // partCard:"4000",
                isActive:1
            }
          chai
            .request(server)
            .post("/api/booking/newBooking")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBooking)
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
          const newBooking = {
            guestName:"Lee Junho",
            address:"Ponda",
            phone:"8687891100",
            email:"leejunho@mail.com",
            dob:"25-01-1996",
            country:"Indiaaa",
            state:"Goaaa",
            city:"Ponda",
            // GSTNumber:"gty77889989",
            // governmentId:"gty77889989",
            totalGuestCount:5,
            // numOfKids:0,
            numOfTeens:1,
            // discountId:2,
            // panelDiscountId:1,
            couponId:0,
            // referredBy:"testUser",
            settledByCompany:0,
            packageId:"[1]",
            packageName:"['Testing OTP']",
            packageGuestCount:"[4]",
            userId:1000,
            userTypeId:1,
            // futureDate:"2023-10-25",
            shiftId:1,
            teensPrice:1000,
            teensRate:847.558,
            teensTax:18,
            teensTaxName:"GST",
            actualAmount:6000,
            amountAfterDiscount:6000,
            paymentMode:"Cash",
            // partCash:"2000",
            // partCard:"4000",
            isActive:1
        }
          chai
            .request(server)
            .post("/api/booking/newBooking")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBooking)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10007);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("User does not exist");
              done();
            });
        });
        it("should return user type does not exist", (done) => {
          const newBooking = {
            guestName:"Lee Junho",
            address:"Ponda",
            phone:"8687891100",
            email:"leejunho@mail.com",
            dob:"25-01-1996",
            country:"Indiaaa",
            state:"Goaaa",
            city:"Ponda",
            // GSTNumber:"gty77889989",
            // governmentId:"gty77889989",
            totalGuestCount:5,
            // numOfKids:0,
            numOfTeens:1,
            // discountId:2,
            // panelDiscountId:1,
            couponId:0,
            // referredBy:"testUser",
            settledByCompany:0,
            packageId:"[1]",
            packageName:"['Testing OTP']",
            packageGuestCount:"[4]",
            userId:1,
            userTypeId:9,
            // futureDate:"2023-10-25",
            shiftId:1,
            teensPrice:1000,
            teensRate:847.558,
            teensTax:18,
            teensTaxName:"GST",
            actualAmount:6000,
            amountAfterDiscount:6000,
            paymentMode:"Cash",
            // partCash:"2000",
            // partCard:"4000",
            isActive:1
        }
          chai
            .request(server)
            .post("/api/booking/newBooking")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBooking)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10008);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("UserType does not exist");
              done();
            });
        });
    });
    describe("Display Packages", () => {
        it("should display all the enabled packages", (done) => {
          chai
            .request(server)
            .get("/api/booking/displayPackages")
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
              expect(res.body.Details).to.have.property("packageDetails")
              expect(res.body.Details.packageDetails).to.be.an("array")
              expect(res.body.Details).to.have.property("packageItemDetails")
              expect(res.body.Details.packageItemDetails).to.be.an("array")
              done();
            });
        });
      });
    describe("Display Booking Details", () => {
        it("should display booking details", (done) => {
          chai
            .request(server)
            .get("/api/booking/getBookingDetails?bookingId=1")
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
        it("should return no booking", (done) => {
          chai
            .request(server)
            .get("/api/booking/getBookingDetails?bookingId=100")
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
                .to.be.eq("Booking Does not exist");
              done();
            });
        });
      });
    describe("Fetch Booking Details", () => {
        it("should fetch booking details", (done) => {
            chai
              .request(server)
              .get("/api/booking/fetchBookings")
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
        it("should fetch booking details based on future date", (done) => {
          chai
            .request(server)
            .get("/api/booking/fetchBookings?futureDate=2023-08-31")
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
        it("should return no booking for selected date", (done) => {
          chai
            .request(server)
            .get("/api/booking/fetchBookings?futureDate=2023-09-31")
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
                .to.be.eq("No Bookings For Selected Date");
              done();
            });
        });
        
      });
      describe("Update Booking", () => {
        it("should update booking details", (done) => {
            const newBooking = {
                bookingId:1,
                guestName:"Young Seo",
                address:"Ponda",
                dob:"25-01-1997",
                country:"Indiaaa",
                state:"Goaaa",
                city:"Ponda",
                // GSTNumber:"6hhbjfj",
                // governmentId:"fcgcyg6t67",
                isActive:1,
            }
          chai
            .request(server)
            .put("/api/booking/updateBooking")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBooking)
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
        it("should return booking does not exist", (done) => {
          const newBooking = {
            bookingId:100,
            guestName:"Young Seo",
            address:"Ponda",
            dob:"25-01-1997",
            country:"Indiaaa",
            state:"Goaaa",
            city:"Ponda",
            // GSTNumber:"6hhbjfj",
            // governmentId:"fcgcyg6t67",
            isActive:1,
        }
          chai
            .request(server)
            .put("/api/booking/updateBooking")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newBooking)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10010);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("Booking Does not exist");
              done();
            });
        });
       
    });
  });