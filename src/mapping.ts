import { BigInt } from "@graphprotocol/graph-ts"
import {
  OnCraft,
  OnRecipeAdd,
  OnRecipeDelete,
  OwnershipTransferred
} from "../generated/Crafting/Crafting"
import { Recipe, Craft } from "../generated/schema"

export function handleOnCraft(event: OnCraft): void {
  var craft = Craft.load(event.transaction.from.toHex())
  if (!craft) {
    craft = new Craft(event.transaction.from.toHex())
    craft.count = BigInt.fromI32(0)
  }
  craft.count = craft.count.plus(BigInt.fromI32(1));
  craft.user = event.params.user;
  craft.recipe = event.params.recipeId.toHex();
  craft.save()
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
