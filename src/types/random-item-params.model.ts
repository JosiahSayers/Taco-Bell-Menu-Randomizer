export class RandomItemParams {
  categories: string[];
  alwaysIncludeAddons: string[];
  alwaysInclueSauces: string[];
  excludeAddons: string[];
  excludeSauces: string[];
  allowItemRemoval: boolean;
  maxNumberOfSauces: number;

  constructor(params: Partial<RandomItemParams>) {
    this.categories = params.categories ?? [];
    this.alwaysIncludeAddons = params.alwaysIncludeAddons ?? [];
    this.alwaysInclueSauces = params.alwaysInclueSauces ?? [];
    this.excludeAddons = params.excludeAddons ?? [];
    this.excludeSauces = params.excludeSauces ?? [];
    this.allowItemRemoval = params.allowItemRemoval ?? true;
    this.maxNumberOfSauces = params.maxNumberOfSauces ?? 2;
  }
}
