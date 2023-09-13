import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";

export default class UpdateProductUseCase {

	private productRepository: ProductRepository;

	constructor(productRepository: ProductRepository) {
		this.productRepository = productRepository;
	}

	async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {

		const productToUpdate = await this.productRepository.find(input.id);

		if (!productToUpdate.id) {
			throw new Error("Product not found");
		}

		productToUpdate.changeName(input.name);
		productToUpdate.changePrice(input.price);

		await this.productRepository.update(input as Product);

		return {
			id: productToUpdate.id,
			name: productToUpdate.name,
			price: productToUpdate.price,
		}
	}

}