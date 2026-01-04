export interface PantryItem {
  id?: string;
  userId?: string;
  ingredientName: string;
  category: string;
  amount: string;
  unit?: string;
  expirationDate?: Date;
  addedDate?: Date;
}
