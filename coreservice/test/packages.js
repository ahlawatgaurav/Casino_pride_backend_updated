let chai = require("chai");
let server = require("../index");
const chaiHttp = require("chai-http");

//Assertion Style
const expect = chai.expect;

chai.use(chaiHttp);

describe("Package APIs", () => {   
    describe("Get All Packages", () => {
        it("should get all packages", (done) => {
          chai
            .request(server)
            .get("/api/core/package")
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
              expect(res.body.Details).to.have.property("packageDetails");
              expect(res.body.Details.packageDetails).to.be.an("array");
              expect(res.body.Details).to.have.property("packageItemDetails");
              expect(res.body.Details.packageItemDetails).to.be.an("array");
              //   .to.have.lengthOf.at.least(1);
              done();
            });
        });
      });
    describe("Add Package", () => {
        it("should add a new package", (done) => {
          const newPackage = {
            packageName:"Testing OTP",
            packageDescription:"This is OTP Premium Package",
            packageWeekdayPrice:2000,
            packageWeekendPrice:2200,
            packageTeensPrice:1000,
            packageTeensRate:847.457,
            packageTeensTax:18,
            packageTeensTaxName:"GST",
            numOfItems:2,
            isPackageEnabled:1,
            packageItems:[
                {
                itemName:"Food,Entry,OTP",
                itemWeekdayPrice:1750,
                itemWeekendPrice:1950,
                itemTax:28,
                itemTaxName:"GST",
                itemWeekdayRate:1367.19,
                itemWeekendRate:1718.75,
                taxDiffWeekday:200,
                taxDiffWeekend:500,
                isDeductable:1
               
            },
                {
                itemName:"Liquor",
                itemWeekdayPrice:250,
                itemWeekendPrice:450,
                itemTax:22,
                itemTaxName:"VAT",
                itemWeekdayRate:204.92,
                itemWeekendRate:351.57,
                taxDiffWeekday:250,
                taxDiffWeekend:300,
                isDeductable:0
               
            }
            ]
        }
          chai
            .request(server)
            .post("/api/core/package")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newPackage)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error").to.be.null
              expect(res.body)
                .to.have.property("Details")
                .to.be.an("array");
              //   .to.eq("Billing Engineer Added Successfully");
              done();
            });
        });
        it("should be package exists", (done) => {
            const newPackage = {
                packageName:"Testing OTP",
                packageDescription:"This is OTP Premium Package",
                packageWeekdayPrice:2000,
                packageWeekendPrice:2200,
                packageTeensPrice:1000,
                packageTeensRate:847.457,
                packageTeensTax:18,
                packageTeensTaxName:"GST",
                numOfItems:2,
                isPackageEnabled:1,
                packageItems:[
                    {
                    itemName:"Food,Entry,OTP",
                    itemWeekdayPrice:1750,
                    itemWeekendPrice:1950,
                    itemTax:28,
                    itemTaxName:"GST",
                    itemWeekdayRate:1367.19,
                    itemWeekendRate:1718.75,
                    taxDiffWeekday:200,
                    taxDiffWeekend:500,
                    isDeductable:1
                   
                },
                    {
                    itemName:"Liquor",
                    itemWeekdayPrice:250,
                    itemWeekendPrice:450,
                    itemTax:22,
                    itemTaxName:"VAT",
                    itemWeekdayRate:204.92,
                    itemWeekendRate:351.57,
                    taxDiffWeekday:250,
                    taxDiffWeekend:300,
                    isDeductable:0
                   
                }
                ]
            }
    
          chai
            .request(server)
            .post("/api/core/package")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newPackage)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10018);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("This Package already exists");
              done();
            });
        });
    });
    describe("Update Package", () => {
        it("should Update a package", (done) => {
          const newPackage = {   
          packageId:1,
          packageRef:"ab8222c0-5918-11ee-9b16-9227c8d1a2ef",
          packageName:"Testing OOTP",
          packageDescription:"Lorem ipsum is Testing OOTP",
          packageWeekdayPrice:2000,
          packageWeekendPrice:2200,
          packageTeensPrice:1000,
          packageTeensRate:847.457,
          packageTeensTax:18,
          packageTeensTaxName:"GST",
          numOfItems:2,
          isPackageEnabled:1,
          packageItems:[
              {
              itemId:1,
              itemRef:"ab8b505f-5918-11ee-9b16-9227c8d1a2ef",
              itemName:"Food,Entry",
              itemWeekdayPrice:1750,
              itemWeekendPrice:1950,
              itemTax:28,
              itemTaxName:"GST",
              itemWeekdayRate:1367.19,
              itemWeekendRate:1718.75,
              taxDiffWeekday:200,
              taxDiffWeekend:500,
              isDeductable:1
              
          },
              {
              itemId:2,
              itemRef:"ab927d6d-5918-11ee-9b16-9227c8d1a2ef",
              itemName:"Liquor",
              itemWeekdayPrice:250,
              itemWeekendPrice:450,
              itemTax:22,
              itemTaxName:"VAT",
              itemWeekdayRate:204.92,
              itemWeekendRate:351.57,
              taxDiffWeekday:250,
              taxDiffWeekend:300,
              isDeductable:0
             
          }
          ]
      }
          chai
            .request(server)
            .put("/api/core/package")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newPackage)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error").to.be.null
              expect(res.body)
                .to.have.property("Details")
                .to.be.an("array");
              //   .to.eq("Billing Engineer Added Successfully");
              done();
            });
        });
        it("should be package does not exists", (done) => {
            const newPackage = {   
                packageId:1,
                packageRef:"ab8222c0-5918-11ee-9b16-9227c8d1a2effg",
                packageName:"Testing OOTP",
                packageDescription:"Lorem ipsum is Testing OOTP",
                packageWeekdayPrice:2000,
                packageWeekendPrice:2200,
                packageTeensPrice:1000,
                packageTeensRate:847.457,
                packageTeensTax:18,
                packageTeensTaxName:"GST",
                numOfItems:2,
                isPackageEnabled:1,
                packageItems:[
                    {
                    itemId:1,
                    itemRef:"ab8b505f-5918-11ee-9b16-9227c8d1a2ef",
                    itemName:"Food,Entry",
                    itemWeekdayPrice:1750,
                    itemWeekendPrice:1950,
                    itemTax:28,
                    itemTaxName:"GST",
                    itemWeekdayRate:1367.19,
                    itemWeekendRate:1718.75,
                    taxDiffWeekday:200,
                    taxDiffWeekend:500,
                    isDeductable:1
                    
                },
                    {
                    itemId:2,
                    itemRef:"ab927d6d-5918-11ee-9b16-9227c8d1a2ef",
                    itemName:"Liquor",
                    itemWeekdayPrice:250,
                    itemWeekendPrice:450,
                    itemTax:22,
                    itemTaxName:"VAT",
                    itemWeekdayRate:204.92,
                    itemWeekendRate:351.57,
                    taxDiffWeekday:250,
                    taxDiffWeekend:300,
                    isDeductable:0
                   
                }
                ]
            }
    
          chai
            .request(server)
            .put("/api/core/package")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newPackage)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10019);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("Package Does not exist");
              done();
            });
        });
        it("should be package item does not exists", (done) => {
            const newPackage = {   
                packageId:1,
                packageRef:"ab8222c0-5918-11ee-9b16-9227c8d1a2ef",
                packageName:"Testing OOTP",
                packageDescription:"Lorem ipsum is Testing OOTP",
                packageWeekdayPrice:2000,
                packageWeekendPrice:2200,
                packageTeensPrice:1000,
                packageTeensRate:847.457,
                packageTeensTax:18,
                packageTeensTaxName:"GST",
                numOfItems:2,
                isPackageEnabled:1,
                packageItems:[
                    {
                    itemId:1,
                    itemRef:"ab8b505f-5918-11ee-9b16-9227c8d1a2efhj",
                    itemName:"Food,Entry",
                    itemWeekdayPrice:1750,
                    itemWeekendPrice:1950,
                    itemTax:28,
                    itemTaxName:"GST",
                    itemWeekdayRate:1367.19,
                    itemWeekendRate:1718.75,
                    taxDiffWeekday:200,
                    taxDiffWeekend:500,
                    isDeductable:1
                    
                },
                    {
                    itemId:2,
                    itemRef:"ab927d6d-5918-11ee-9b16-9227c8d1a2ef",
                    itemName:"Liquor",
                    itemWeekdayPrice:250,
                    itemWeekendPrice:450,
                    itemTax:22,
                    itemTaxName:"VAT",
                    itemWeekdayRate:204.92,
                    itemWeekendRate:351.57,
                    taxDiffWeekday:250,
                    taxDiffWeekend:300,
                    isDeductable:0
                   
                }
                ]
            }
    
          chai
            .request(server)
            .put("/api/core/package")
            .set("Authorization", `Qm94d1I5MFA6U3BMSlQ1NFFk`)
            .set(
              "AuthToken",
              `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVGh1IFNlcCAyOCAyMDIzIDEyOjQxOjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwiaWF0IjoxNjk1ODg1MTExfQ.Kq2Z-TF-EwBZN9yZULawYlBWC8FovkSfL7OeK3iGUBo`
            )
            .send(newPackage)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an("object");
              expect(res.body).to.have.property("Error");
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10020);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("Item Does not exist");
              done();
            });
        });
    });
    describe("Delete Package", () => {
        it("should delete a package", (done) => {
          chai
            .request(server)
            .delete("/api/core/package?packageId=6")
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
    
        it("should be invalid id", (done) => {
          chai
            .request(server)
            .delete("/api/core/package?packageId=90")
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
              expect(res.body.Error).to.have.property("ErrorCode").to.be.eq(10021);
              expect(res.body.Error)
                .to.have.property("ErrorMessage")
                .to.be.eq("Invalid Package Id");
              done();
            });
        });
      });
    describe("Get Package Details", () => {
        it("should get a package details", (done) => {
          chai
            .request(server)
            .get("/api/core/getPackageDetails?packageId=6")
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
              expect(res.body.Details).to.have.property("packageDetails");
              expect(res.body.Details.packageDetails).to.be.an("object");
              expect(res.body.Details).to.have.property("packageItemDetails");
              expect(res.body.Details.packageItemDetails).to.be.an("array");
              done();
            });
        });
      });
  });