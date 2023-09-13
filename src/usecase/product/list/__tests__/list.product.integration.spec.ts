import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../../domain/product/factory/product.factory";
import Product from "../../../../domain/product/entity/product";
import ListProductUseCase from "../list.product.usecase";

describe('Integration tests for list all products use case', () => {

	const productRepository = new ProductRepository();
	const listUseCase = new ListProductUseCase(productRepository);

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
		const validProduct2 = ProductFactory.create("b", "Product B", 456) as Product;
		const validProduct3 = ProductFactory.create("a", "Product C", 789) as Product;

		await productRepository.create(validProduct);
		await productRepository.create(validProduct2);
		await productRepository.create(validProduct3);


		const output = await listUseCase.execute();

		expect(output.products).toHaveLength(3);

		expect(output.products[0].id).toEqual(validProduct.id);
		expect(output.products[0].name).toEqual(validProduct.name);

		expect(output.products[1].id).toEqual(validProduct2.id);
		expect(output.products[1].name).toEqual(validProduct2.name);

		expect(output.products[2].id).toEqual(validProduct3.id);
		expect(output.products[2].name).toEqual(validProduct3.name);

	})

	it('should return a empty list when no products found', async () => {

		const output = await listUseCase.execute();

		expect(output.products).toHaveLength(0);
	})


})