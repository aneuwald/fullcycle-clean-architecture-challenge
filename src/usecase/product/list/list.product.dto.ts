import Product from "../../../domain/product/entity/product";

export interface InputListProductDto {}

export interface OutputListProductDto {
	products: Product[];
}