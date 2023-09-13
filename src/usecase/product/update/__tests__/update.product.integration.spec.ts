import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../../domain/product/factory/product.factory";
import Product from "../../../../domain/product/entity/product";
import UpdateProductUseCase from "../update.product.usecase";
import { InputUpdateProductDto } from "../update.product.dto";


describe('Integration tests for list all products use case', () => {

	const productRepository = new ProductRepository();
	const updateUseCase = new UpdateProductUseCase(productRepository);

	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
			sync: { force: true },
		});

		await sequelize.addModels([ProductModel]);
		await sequelize.sync();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it('should list all products with valid params', async () => {

		const validProduct = ProductFactory.create("a", "Product A", 123) as Product;

		await productRepository.create(validProduct);

		const input: InputUpdateProductDto = {
			id: validProduct.id,
			name: "Product A Updated",
			price: 123456,
		};

		const output = await updateUseCase.execute(input);

		expect(output.id).toEqual(validProduct.id);
		expect(output.name).toEqual(input.name);
		expect(output.price).toEqual(input.price);

	})

	it('should thrown an error when Product not found', async () => {

		const input: InputUpdateProductDto = {
			id: "lalala no exist",
			name: "Product A Updated",
			price: 123456,
		};

		await expect(updateUseCase.execute(input)).rejects.toThrow(
			"Product not found"
		);

	})


})