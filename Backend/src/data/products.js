export const PRODUCTS = [
  {
    productId:   "foundation",
    productType: "batch",
    name:        "DSA Foundation Program",
    price:       499900, // ₹4,999 in paise
  },
  {
    productId:   "accelerator",
    productType: "batch",
    name:        "DSA Accelerator Program",
    price:       699900, // ₹6,999 in paise
  },
  {
    productId:   "placement",
    productType: "batch",
    name:        "Placement Mastery Program",
    price:       999900, // ₹9,999 in paise
  },
];

export const PRODUCT_TIER_RANK = {
  foundation:  1,
  accelerator: 2,
  placement:   3,
};

export function getProduct(productId) {
  return PRODUCTS.find((p) => p.productId === productId) ?? null;
}

/** Returns the Product object for the highest purchased tier, or null */
export function getHighestPurchasedProduct(purchasedProducts) {
  if (!purchasedProducts?.length) return null;
  let maxRank = 0;
  let highest = null;
  for (const p of purchasedProducts) {
    const rank = PRODUCT_TIER_RANK[p.productId] ?? 0;
    if (rank > maxRank) {
      const product = PRODUCTS.find((prod) => prod.productId === p.productId);
      if (product) { maxRank = rank; highest = product; }
    }
  }
  return highest;
}

/**
 * Returns the amount to charge in paise for a target product,
 * after deducting the price of what the user has already purchased.
 * Returns the full product price if no prior purchase exists.
 */
export function computeUpgradeAmountPaise(targetProduct, highestPurchasedProduct) {
  if (!highestPurchasedProduct) return targetProduct.price;
  return Math.max(0, targetProduct.price - highestPurchasedProduct.price);
}
