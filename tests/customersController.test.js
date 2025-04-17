// __tests__/customersController.test.js

const request = require("supertest");
const app = require("../server"); // Adjust the path to your app.js
const mongodb = require("../data/database"); // Adjust the path to your database
const { ObjectId } = require("mongodb");

jest.mock("../data/database"); // Mock the database connection

describe("Customers Controller", () => {
  describe("GET /customers", () => {
    it("should return a list of customers", async () => {
      const mockCustomer = {
        _id: new ObjectId("644c3a3a3a3a3a3a3a3a3a01"), // Mocking a MongoDB ObjectId
        name: "Alice Smith",
        email: "alice@example.com",
        address: {
          street: "123 Maple St",
          city: "Somewhere",
          zip: "12345",
        },
        createdAt: new Date("2024-10-10T08:00:00.000+00:00"),
        updatedAt: new Date("2025-04-17T21:15:02.284+00:00"),
      };

      // Mocking a MongoDB database response in the test
      mongodb
        .getDatabase()
        .db()
        .collection()
        .find.mockResolvedValue({
          toArray: jest.fn().mockResolvedValue([mockCustomer]),
        });

      const response = await request(app).get("/customers"); // Replace '/customers' with your actual route

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCustomers); // Check if response matches mock data
    });

    it("should return an empty array when no customers are found", async () => {
      // Mock empty database response
      mongodb
        .getDatabase()
        .db()
        .collection()
        .find.mockResolvedValue({
          toArray: jest.fn().mockResolvedValue([]),
        });

      const response = await request(app).get("/customers"); // Replace '/customers' with your actual route

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]); // Check if response is empty
    });

    it("should return 500 if there is an error retrieving customers", async () => {
      // Mock the database throwing an error
      mongodb
        .getDatabase()
        .db()
        .collection()
        .find.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/customers"); // Replace '/customers' with your actual route

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal server error");
    });
  });

  describe("GET /customers/:id", () => {
    it("should return a specific customer by ID", async () => {
      const customerId = new ObjectId();
      const mockCustomer = {
        _id: customerId,
        name: "Customer 1",
        email: "customer1@example.com",
        address: "123 Main St",
      };

      // Mock the database call for find() and toArray()
      mongodb
        .getDatabase()
        .db()
        .collection()
        .find.mockResolvedValue({
          toArray: jest.fn().mockResolvedValue([mockCustomer]),
        });

      const response = await request(app).get(`/customers/${customerId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCustomer); // Check if response matches mock data
    });

    it("should return 404 if customer is not found", async () => {
      const invalidCustomerId = new ObjectId();

      // Mock database returning an empty result for the invalid ID
      mongodb
        .getDatabase()
        .db()
        .collection()
        .find.mockResolvedValue({
          toArray: jest.fn().mockResolvedValue([]),
        });

      const response = await request(app).get(
        `/customers/${invalidCustomerId}`
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        `Customer not found: ${invalidCustomerId}`
      );
    });

    it("should return 500 if there is an error retrieving the customer", async () => {
      const invalidCustomerId = new ObjectId();

      // Mock the database throwing an error
      mongodb
        .getDatabase()
        .db()
        .collection()
        .find.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get(
        `/customers/${invalidCustomerId}`
      );

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal server error");
    });
  });
});

