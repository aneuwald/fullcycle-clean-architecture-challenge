import Product from "../../../../domain/product/entity/product";
import ProductFactory from "../../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../../domain/product/repository/product-repository.interface";
import { InputFindProductDto } from "../find.product.dto";
import { FindProductUseCase } from "../find.product.usecase";

describe('Unit tests for find a product use case', () => {

	const defaultInput: InputFindProductDto = {
		id: "123"
	};

	const mockProduct = ProductFactory.create("a", "Product A", 123);

	const MockRepository = () => {
		return {
			find: jest.fn().mockReturnValue(Promise.resolve(mockProduct)),
			findAll: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
		};
	};

	it('should create a product with valid params', async () => {

		const mockRepository = MockRepository();
		const findProductUseCase = new FindProductUseCase(mockRepository);

		const output = await findProductUseCase.execute(defaultInput);

		expect(output.id).toEqual(mockProduct.id);
		expect(output.name).toEqual(mockProduct.name);
		expect(output.price).toEqual(mockProduct.price);
	})

	it('should thrown an error when Product not found', async () => {

		const mockRepository = MockRepository();

		mockRepository.find.mockImplementation(() => {
			throw new Error("Product not found");
		});

		const findProductUseCase = new FindProductUseCase(mockRepository);

		const customInput = {
			...defaultInput,
			id: "lalala"
		};

		await expect(findProductUseCase.execute(customInput)).rejects.toThrow(
			"Product not found"
		);

	})


})