import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  OnCraft,
  OnRecipeAdd,
  OnRecipeDelete,
  OwnershipTransferred
} from "../generated/Crafting/Crafting";
import { concat } from "@graphprotocol/graph-ts/helper-functions";
import { Recipe, Craft } from "../generated/schema";

export function handleOnCraft(event: OnCraft): void {
  var craftId = getCraftId(event.params.user, event.params.recipeId);
  var craft = Craft.load(craftId);
  if (!craft) {
    craft = new Craft(craftId);
    craft.count = BigInt.fromI32(0);
    craft.user = event.params.user;
  }
  craft.count = craft.count.plus(BigInt.fromI32(1));

  craft.recipe = event.params.recipeId.toHex();
  craft.save()
}

export function getCraftId(user: Address, recipeId: BigInt): string {
  return concat(user, Bytes.fromBigInt(recipeId)).toHex();
}

export function handleOnRecipeAdd(event: OnRecipeAdd): void {
  var recipe = new Recipe(event.params.id.toHex());
  recipe.ingredients = event.params.ingredients;
  recipe.ingredientQuantities = event.params.ingredientQuantities;
  recipe.products = event.params.products;
  recipe.productQuantities = event.params.productQuantities;
  recipe.disabled = false;
  recipe.save();
}

export function handleOnRecipeDelete(event: OnRecipeDelete): void {
  var recipe = Recipe.load(event.params.id.toHex()) as Recipe;
  if (!recipe) return;
  recipe.disabled = true;
  recipe.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }
