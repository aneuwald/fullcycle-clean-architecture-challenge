import ProductRepositoryInterface from "../../../../domain/product/repository/product-repository.interface";
import { InputCreateProductDto } from "../create.product.dto";
import CreateProductUseCase from "../create.product.usecase";

describe('Unit tests for create product use case', () => {

	const defaultInput: InputCreateProductDto = {
		name: "John",
		price: 123,
	};

	const MockRepository: () => ProductRepositoryInterface = () => {
		return {
			find: jest.fn(),
			findAll: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
		};
	};

	it('should create a product with valid params', async () => {

		const mockRepository = MockRepository();
		const createProductUseCase = new CreateProductUseCase(mockRepository);

		const output = await createProductUseCase.execute(defaultInput);

		expect(output).toEqual({
			id: expect.any(String),
			name: defaultInput.name,
			price: defaultInput.price,
		});
	})

	it('should thrown an error when name is missing', async () => {

		const mockRepository = MockRepository();
		const createProductUseCase = new CreateProductUseCase(mockRepository);

		const customInput = {
			...defaultInput,
			name: ""
		};

		await expect(createProductUseCase.execute(customInput)).rejects.toThrow(
			"Name is required"
		);

	})

	it('should thrown an error when price is negative', async () => {

		const mockRepository = MockRepository();
		const createProductUseCase = new CreateProductUseCase(mockRepository);

		const customInput = {
			...defaultInput,
			price: -5
		};

		await expect(createProductUseCase.execute(customInput)).rejects.toThrow(
			"Price must be greater than zero"
		);

	})


})