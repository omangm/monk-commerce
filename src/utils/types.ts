export interface IDiscount {
	type: "flat" | "percentage";
	value: number;
}

export interface IVariant {
	id: number;
	product_id: number;
	title: string;
	price: number;
	inventory_quantity: number;
	discount?: IDiscount;
}

export interface Image {
	id: number;
	product_id: number;
	src: string;
}

export interface IProduct {
	id: number;
	title: string;
	variants: IVariant[];
	image?: Image;
	discount?: IDiscount;
}

export interface ISearchResult extends IProduct {
	selected: boolean;
}
