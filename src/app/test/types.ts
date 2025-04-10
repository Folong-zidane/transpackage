// types.ts
export type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  imageUrl: string;
  rating: number;
  commission: number;
  inStock: boolean;
  deliveryTime?: string; // Optionnel car certains produits n'ont pas de délai de livraison
};