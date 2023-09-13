import Product from "../../../../domain/product/entity/product";
import { InputUpdateProductDto } from "../update.product.dto"
import UpdateProductUseCase from "../update.product.usecase";

describe('Unit tests for update product use case', () => {

	const input: InputUpdateProductDto = {
		id: "123",
		name: "Product A Updated",
		price: 123456,
	};

	const originalProduct = new Product("123", "Product A", 123);
	const expectedUpdateProduct = new Product(input.id, input.name, input.price);

	const MockRepository = () => {
		return {
			find: jest.fn().mockReturnValue(Promise.resolve(originalProduct)),
			findAll: jest.fn(),
			create: jest.fn(),
			update: jest.fn().mockReturnValue(Promise.resolve(expectedUpdateProduct)),
		};
	};

	it('should update a product with valid params', async () => {

		const mockRepository = MockRepository();

		const updateProductUseCase = new UpdateProductUseCase(mockRepository);

		const output = await updateProductUseCase.execute(input);

		expect(output.id).toEqual(expectedUpdateProduct.id);
		expect(output.name).toEqual(expectedUpdateProduct.name);
		expect(output.price).toEqual(expectedUpdateProduct.price);

	})

	it('should thrown an error when Product not found', async () => {

		const mockRepository = MockRepository();

		mockRepository.find.mockImplementation(() => {
			throw new Error("Product not found");
		});

		const updateProductUseCase = new UpdateProductUseCase(mockRepository);

		await expect(updateProductUseCase.execute(input)).rejects.toThrow(
			"Product not found"
		);
	})

})