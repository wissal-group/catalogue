export interface Product {
  productId: string;
  categoryId: string;
  characteristics: [{ string: { key: string, value: string } }];
  createDate: string;
  descriptionDetails: string;
  EanCode: string;
  imgURL: string [];
  modifyDate: string;
  thumbURL: string [];
  timestamp: string;
  title: string;
  brand: string;
}

