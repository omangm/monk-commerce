export interface IVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
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
}
