import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../../infrastructure/product/repository/sequelize/product.repository";
import { FindProductUseCase } from "../find.product.usecase";
import { InputFindProductDto } from "../find.product.dto";
import ProductFactory from "../../../../domain/product/factory/product.factory";
import Product from "../../../../domain/product/entity/product";

describe('Integration tests for find a product use case', () => {

	const productRepository = new ProductRepository();
	const findUseCase = new FindProductUseCase(productRepository);

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

	it('should find a product with valid params', async () => {

		const validProduct = ProductFactory.create("a", "Product A", 123) as Product;
		const validProduct2 = ProductFactory.create("b", "Product B", 456) as Product;

		await productRepository.create(validProduct);
		await productRepository.create(validProduct2);

		const validInput: InputFindProductDto = {
			id: validProduct.id
		};

		const output = await findUseCase.execute(validInput);

		expect(output).toEqual({
			id: expect.any(String),
			name: validProduct.name,
			price: validProduct.price,
		});

	})

	it('should thrown an error when Product not found', async () => {

		const invalidInput: InputFindProductDto = {
			id: "lalala no exist"
		};

		await expect(findUseCase.execute(invalidInput)).rejects.toThrow(
			"Product not found"
		);

	})

})