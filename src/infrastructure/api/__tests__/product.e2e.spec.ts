import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {

	beforeEach(async () => {
		await sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await sequelize.close();
	});

	it('should create a product with valid params', async () => {

		const response = await request(app)
			.post("/product")
			.send({
				name: "Product A",
				price: 123,
			});


		expect(response.status).toBe(200);
		expect(response.body.id).toEqual(expect.any(String));
		expect(response.body.name).toEqual("Product A");
		expect(response.body.price).toEqual(123);

	})

	it("should list all products", async () => {

		const product1 = await request(app)
			.post("/product")
			.send({
				name: "Product A",
				price: 123,
			});

		const product2 = await request(app)
			.post("/product")
			.send({
				name: "Product B",
				price: 456,
			});

		const responseList = await request(app)
			.get("/product/all")
			.send();

		expect(responseList.status).toBe(200);
		expect(responseList.body.products).toHaveLength(2);

		expect(responseList.body.products[0].id).toEqual(product1.body.id);
		expect(responseList.body.products[0].name).toEqual("Product A");
		expect(responseList.body.products[0].price).toEqual(123);

		expect(responseList.body.products[1].id).toEqual(product2.body.id);
		expect(responseList.body.products[1].name).toEqual("Product B");
		expect(responseList.body.products[1].price).toEqual(456);

	});

});
