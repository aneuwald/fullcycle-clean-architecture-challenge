import Product from "../../../domain/product/entity/product";

export interface InputListProductDto {}


type OutputProductInterface = {
	id: string;
	name: string;
	price: number;
}

export interface OutputListProductDto {
	products: OutputProductInterface[];
}