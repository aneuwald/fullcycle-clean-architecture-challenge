import { Sequelize } from "sequelize-typescript";
import { InputCreateProductDto } from "../create.product.dto";
import ProductModel from "../../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create.product.usecase";

describe('Integration tests for create product use case', () => {

	const productRepository = new ProductRepository();

	const createUseCase = new CreateProductUseCase(productRepository);

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

	it('should create a product with valid params', async () => {

		const validInput: InputCreateProductDto = {
			name: "John",
			price: 123,
		};

		const output = await createUseCase.execute(validInput);

		expect(output).toEqual({
			id: expect.any(String),
			name: validInput.name,
			price: validInput.price,
		});

	})

	it('should thrown an error when name is missing', async () => {

		const invalidInput: InputCreateProductDto = {
			name: "",
			price: 123,
		};

		await expect(createUseCase.execute(invalidInput)).rejects.toThrow(
			"Name is required"
		);

	})

	it('should thrown an error when price is negative', async () => {

		const invalidInput: InputCreateProductDto = {
			name: "John",
			price: -5,
		};

		await expect(createUseCase.execute(invalidInput)).rejects.toThrow(
			"Price must be greater than zero"
		);
	})

})