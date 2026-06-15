const PRODUCTS = [
  {
    id: "chicken-chive",
    name: "Chicken & Chive",
    category: "Classic",
    price: 14.9,
    rating: 4.9,
    pieces: 12,
    badge: "Bestseller",
    icon: "🥟",
    description: "Juicy chicken, fragrant chive, thin handmade-style wrapper.",
  },
  {
    id: "beef-pepper",
    name: "Beef Black Pepper",
    category: "Bold",
    price: 17.9,
    rating: 4.8,
    pieces: 12,
    badge: "Popular",
    icon: "🥟",
    description: "Savoury beef filling with a warm black pepper finish.",
  },
  {
    id: "shrimp-corn",
    name: "Shrimp & Sweet Corn",
    category: "Seafood",
    price: 19.9,
    rating: 4.9,
    pieces: 10,
    badge: "Premium",
    icon: "🥟",
    description: "Bouncy shrimp, sweet corn, and a light umami seasoning.",
  },
  {
    id: "mushroom-cabbage",
    name: "Mushroom Cabbage",
    category: "Vegetable",
    price: 13.9,
    rating: 4.7,
    pieces: 12,
    badge: "Plant-forward",
    icon: "🥟",
    description: "Earthy mushrooms, cabbage, carrot, and sesame aroma.",
  },
  {
    id: "spicy-chicken",
    name: "Spiced Chicken",
    category: "Bold",
    price: 15.9,
    rating: 4.8,
    pieces: 12,
    badge: "New",
    icon: "🥟",
    description: "Aromatic chilli spice with tender chicken and spring onion.",
  },
  {
    id: "family-mix",
    name: "Family Mixed Box",
    category: "Bundle",
    price: 44.9,
    rating: 5.0,
    pieces: 36,
    badge: "Save RM 6",
    icon: "🥟",
    description: "Three crowd favourites in one freezer-ready sharing box.",
  },
  {
    id: "student-duo",
    name: "Student Duo Pack",
    category: "Bundle",
    price: 27.9,
    rating: 4.8,
    pieces: 24,
    badge: "Quick pick",
    icon: "🥟",
    description: "Two classic packs made for roommates and study nights.",
  },
  {
    id: "mini-soup",
    name: "Mini Soup Dumplings",
    category: "Classic",
    price: 16.9,
    rating: 4.7,
    pieces: 15,
    badge: "Comfort",
    icon: "🥟",
    description: "Small, juicy dumplings ideal for soup or a quick snack.",
  },
];

const ORDER_STATUSES = ["Confirmed", "Packing", "Shipped", "Delivered"];
const ORDER_ITEMS = [
  "Chicken & Chive × 2",
  "Beef Black Pepper × 1",
  "Family Mixed Box × 1",
  "Shrimp & Sweet Corn × 2",
  "Student Duo Pack × 1",
  "Mushroom Cabbage × 3",
  "Spiced Chicken × 2",
];

function buildOrders(total = 240) {
  return Array.from({ length: total }, (_, index) => {
    const number = 1001 + index;
    const status = ORDER_STATUSES[index % ORDER_STATUSES.length];
    const day = String((index % 28) + 1).padStart(2, "0");
    const hour = String(9 + (index % 11)).padStart(2, "0");
    const deliveryHour = String(11 + (index % 10)).padStart(2, "0");
    return {
      orderNo: `HMB-2606${day}-${number}`,
      deliveryId: `DLY-${String(70001 + index).padStart(5, "0")}`,
      orderDate: `${day} Jun 2026`,
      orderTime: `${hour}:${String((index * 7) % 60).padStart(2, "0")}`,
      deliveryTime: `${deliveryHour}:${String((index * 11) % 60).padStart(2, "0")}`,
      status,
      items: ORDER_ITEMS[index % ORDER_ITEMS.length],
      settlement: index % 5 === 0 ? "Pending" : "Paid",
      total: 18.9 + (index % 8) * 6.5,
    };
  });
}

const ORDERS = buildOrders();
