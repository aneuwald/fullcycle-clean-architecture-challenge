import Product from "../../../../domain/product/entity/product";
import ProductFactory from "../../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../../domain/product/repository/product-repository.interface";
import ListProductUseCase from "../list.product.usecase";

describe('Unit tests for list all products use case', () => {

	const mockProduct1 = ProductFactory.create("a", "Product A", 123);
	const mockProduct2 = ProductFactory.create("a", "Product B", 456);
	const mockProduct3 = ProductFactory.create("a", "Product C", 789);

	const MockRepository = () => {
		return {
			find: jest.fn(),
			findAll: jest.fn().mockReturnValue(Promise.resolve([mockProduct1, mockProduct2, mockProduct3])),
			create: jest.fn(),
			update: jest.fn(),
		};
	};

	it('should create a product with valid params', async () => {

		const mockRepository = MockRepository();
		const listProductUseCase = new ListProductUseCase(mockRepository);

		const output = await listProductUseCase.execute();

		expect(output.products).toHaveLength(3);

		expect(output.products[0].id).toEqual(mockProduct1.id);
		expect(output.products[0].name).toEqual(mockProduct1.name);

		expect(output.products[1].id).toEqual(mockProduct2.id);
		expect(output.products[1].name).toEqual(mockProduct2.name);

		expect(output.products[2].id).toEqual(mockProduct3.id);
		expect(output.products[2].name).toEqual(mockProduct3.name);

	})

	it('should thrown an error when Product not found', async () => {

		const mockRepository = MockRepository();

		mockRepository.findAll.mockImplementation(() => Promise.resolve([]));

		const listProductUseCase = new ListProductUseCase(mockRepository);

		const output = await listProductUseCase.execute();

		expect(output.products).toHaveLength(0);

	})


})