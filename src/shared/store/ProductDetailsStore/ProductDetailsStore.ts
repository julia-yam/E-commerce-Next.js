import type { IReactionDisposer } from "mobx";
import { action, computed, makeObservable, observable, reaction } from "mobx";

import { strapiService } from "@api/strapi";
import { type FormattedProduct } from "@api/types";

interface ILocalStore {
  destroy(): void;
}

type PrivateFields =
  | "_product"
  | "_relatedProducts"
  | "_isInitialized"
  | "_setData"
  | "_setInitialized";

export default class ProductDetailsStore implements ILocalStore {
  private _product: FormattedProduct | null = null;
  private _relatedProducts: FormattedProduct[] = [];
  private _isInitialized: boolean = false;

  private readonly _reactionDisposer: IReactionDisposer;

  constructor() {
    makeObservable<ProductDetailsStore, PrivateFields>(this, {
      _product: observable.ref,
      _relatedProducts: observable.ref,
      _isInitialized: observable,

      product: computed,
      relatedProducts: computed,
      isInitialized: computed,

      _setData: action.bound,
      _setInitialized: action.bound,
      fetchData: action.bound,
    });

    this._reactionDisposer = reaction(
      () => this._product?.documentId,
      (id) => {
        if (id) console.log(`[Store] Данные товара загружены: ${id}`);
      },
    );
  }

  get product(): FormattedProduct | null {
    return this._product;
  }

  get relatedProducts(): FormattedProduct[] {
    return this._relatedProducts;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  private _setData(
    product: FormattedProduct | null,
    related: FormattedProduct[],
  ): void {
    this._product = product;
    this._relatedProducts = related;
  }

  private _setInitialized(state: boolean): void {
    this._isInitialized = state;
  }

  async fetchData(
    id: string,
    initialData?: FormattedProduct | null,
  ): Promise<void> {
    try {
      if (initialData) {
        this._product = initialData;

        this._setInitialized(true);

        const allProductsResponse = await strapiService.getProducts(0, 50);
        const productsArray = allProductsResponse?.items || [];
        const related = this._filterRelated(initialData, productsArray, id);

        this._setData(initialData, related);
        return;
      }

      this._setInitialized(false);

      const [targetProduct, allProductsResponse] = await Promise.all([
        strapiService.getOneProduct(id),
        strapiService.getProducts(0, 50),
      ]);

      if (!targetProduct) {
        this._setData(null, []);
        return;
      }

      const productsArray = allProductsResponse?.items || [];
      const related = this._filterRelated(targetProduct, productsArray, id);

      this._setData(targetProduct, related);
    } catch (err) {
      console.error("[Store] Ошибка при загрузке деталей товара:", err);
      this._setData(null, []);
    } finally {
      this._setInitialized(true);
    }
  }

  private _filterRelated(
    target: FormattedProduct,
    pool: FormattedProduct[],
    currentId: string,
  ): FormattedProduct[] {
    return pool
      .filter((item) => {
        const isSameProduct =
          item.documentId === currentId || item.id === target.id;
        if (isSameProduct) return false;

        const itemCat = item.category?.toLowerCase().trim() || "";
        const targetCat = target.category?.toLowerCase().trim() || "";

        return itemCat === targetCat;
      })
      .slice(0, 3);
  }

  destroy(): void {
    this._reactionDisposer();
    console.log("[Store] ProductDetailsStore уничтожен");
  }
}
