let chai = require("chai");
let server = require("../index");
const chaiHttp = require("chai-http");

//Assertion Style
const expect = chai.expect;

chai.use(chaiHttp);

describe("Users CRUD APIs", () => {   
    describe("Add User", () => {
        it("should add a new user", (done) => {
            const newUser = {
                firebaseUUID: "9866590",
                name: "Simran Beiggg",
                address: "Vasco-Goa",
                email: "simranbeigll.work@gmail.com",
                phone: "8890545000",
                userName: "simmiepp",
                password: "simmieee",
                userType: 2,
                discountPercent: 0,
                monthlySettlement: 0,
                // QRLink: "",
                NumOfBookings: 0,
                isUserEnabled:1,
                isActive:1
            }
          chai
            .request(server)
            .post("/api/core/user")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
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
        it("should return phone number exists", (done) => {
            const newUser = {
                firebaseUUID: "9866590",
                name: "Simran Beig",
                address: "Vasco-Goa",
                email: "simranbeig.work@gmail.com",
                phone: "8890545209",
                userName: "simmie",
                password: "simmieee",
                userType: 2,
                discountPercent: 0,
                monthlySettlement: 0,
              // QRLink: "",
                NumOfBookings: 0,
                isUserEnabled:1,
                isActive:1
            }
    
          chai
            .request(server)
            .post("/api/core/user")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newUser)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10007);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("Phone number already exists");
              done();
            });
        });
        it("should return email exists", (done) => {
            const newUser = {
                firebaseUUID: "9866590",
                name: "Simran Beiggg",
                address: "Vasco-Goa",
                email: "simranbeigll.work@gmail.com",
                phone: "8890545008",
                userName: "simmiepp",
                password: "simmieee",
                userType: 2,
                discountPercent: 0,
                monthlySettlement: 0,
                // QRLink: "",
                NumOfBookings: 0,
                isUserEnabled:1,
                isActive:1
            }
    
          chai
            .request(server)
            .post("/api/core/user")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newUser)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10008);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("Email Already Exists");
              done();
            });
        });
    });
    describe("Update User", () => {
        it("should Update user", (done) => {
            const updateUser = {   
            userId:9,
            userRef:"e4a90996-6525-11ee-9b16-9227c8d1a2ef",
            firebaseUUID: "9866590",
            name: "Simran Beig",
            address: "Vasco-Goa",
            email: "simranbeig.work@gmail.com",
            phone: "8890545209",
            userName: "simmie",
            password: "simmie",
            userType: 2,
            discountPercent: 0,
            monthlySettlement: 0,
            // QRLink: "",
            NumOfBookings: 0,
            isUserEnabled:0,
            isActive:1
        }
          chai
            .request(server)
            .put("/api/core/user")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(updateUser)
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
        it("should return user does not exists", (done) => {
            const updateUser = {   
                userId:37,
                userRef:"211ac0e2-4e08-11ee-9b16-9227c8d1a2ef",
                firebaseUUID: "9876590",
                name: "Simran Beig",
                address: "Vasco-Goa",
                email: "simranbeig.work@gmail.com",
                phone: "8890545209",
                userName: "simmie",
                password: "simmie",
                userType: 2,
                discountPercent: 0,
                monthlySettlement: 0,
                // QRLink: "",
                NumOfBookings: 0,
                isUserEnabled:1,
                isActive:1
            }
    
          chai
            .request(server)
            .put("/api/core/user")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(updateUser)
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
    });
    describe("Get Users", () => {
        it("should get all users", (done) => {
          chai
            .request(server)
            .get("/api/core/user")
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
        it("should return users based on usertype", (done) => {
          chai
            .request(server)
            .get("/api/core/user?userType=3")
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
    
    describe("Delete User", () => {
        it("should delete user", (done) => {
          chai
            .request(server)
            .delete("/api/core/user?userId=1")
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
    
        it("should be invalid id", (done) => {
          chai
            .request(server)
            .delete("/api/core/user?userId=100")
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
                .to.be.eq("Invalid User Id");
              done();
            });
        });
      });
    describe("Count Number of Bookings for Driver", () => {
        it("should update number of bookings for driver", (done) => {
            const newUser = {
                userId:1,
                userType: 1,
            }
          chai
            .request(server)
            .put("/api/core/countDriverBookings")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
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
  });