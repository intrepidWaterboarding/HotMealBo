const PRODUCTS = [
  {
    id: "mee-tarik-beef-soup",
    name: "Mee Tarik Beef Soup",
    category: "Soup Noodles",
    price: 9.0,
    rating: 4.9,
    size: "1 bowl",
    badge: "Bestseller",
    image: "assets/official/mee-tarik-beef-soup.webp",
    imageAlt: "Hot Meal Ba mee tarik beef soup",
    description: "Hand-pulled noodles served in a clear beef broth with herbs and tender beef.",
  },
  {
    id: "beijing-noodles",
    name: "Beijing Noodles",
    category: "Noodles",
    price: 12.8,
    rating: 4.8,
    size: "1 plate",
    badge: "Popular",
    image: "assets/official/beijing-noodles.webp",
    imageAlt: "Hot Meal Ba Beijing noodles",
    description: "Noodles topped with savoury minced sauce, fresh cucumber, carrot, and greens.",
  },
  {
    id: "beef-dingding",
    name: "Fried Noodles with Beef Dingding",
    category: "Fried Noodles",
    price: 15.9,
    rating: 4.8,
    size: "1 plate",
    badge: "Signature",
    image: "assets/official/beef-dingding.webp",
    imageAlt: "Fried noodles with beef dingding",
    description: "Diced noodles stir-fried with beef, vegetables, chilli, and aromatic seasoning.",
  },
  {
    id: "boiled-dumplings",
    name: "Boiled Dumplings",
    category: "Dumplings",
    price: 10.0,
    rating: 4.7,
    size: "10 pcs",
    badge: "Comfort",
    image: "assets/official/boiled-dumplings.webp",
    imageAlt: "A bowl of boiled Hot Meal Ba dumplings with chilli sauce",
    description: "Soft boiled dumplings served hot with a side of chilli dipping sauce.",
  },
  {
    id: "hotmealba-dumplings",
    name: "Hot Meal Ba Dumplings",
    category: "Dumplings",
    price: 10.0,
    rating: 4.9,
    size: "10 pcs",
    badge: "Customer Pick",
    image: "assets/official/hotmealba-dumplings.webp",
    imageAlt: "Hot Meal Ba dumplings on a plate with dipping sauces",
    description: "Classic handmade-style dumplings with soy sauce and chilli oil on the side.",
  },
  {
    id: "dumpling-selection",
    name: "Dumpling Selection",
    category: "Dumplings",
    price: 12.0,
    rating: 4.8,
    size: "6-15 pcs",
    badge: "Mixed Choice",
    image: "assets/official/dumpling-selection.webp",
    imageAlt: "Hot Meal Ba dumpling selection menu",
    description: "Choose from chicken mushroom, beef carrot, egg leek, or lamb onion dumplings.",
  },
  {
    id: "xinjiang-lamb-skewers",
    name: "Xinjiang Lamb Skewers",
    category: "Grill",
    price: 15.0,
    rating: 4.8,
    size: "6 skewers",
    badge: "Spiced",
    image: "assets/official/xinjiang-lamb-skewers.webp",
    imageAlt: "Hot Meal Ba Xinjiang-style lamb skewers",
    description: "Charred lamb skewers seasoned with chilli, cumin, and Xinjiang-style spices.",
  },
];

const ORDER_STATUSES = ["Confirmed", "Packing", "Shipped", "Delivered"];
const ORDER_ITEMS = [
  "Mee Tarik Beef Soup × 1",
  "Beijing Noodles × 1",
  "Fried Noodles with Beef Dingding × 1",
  "Boiled Dumplings × 2",
  "Hot Meal Ba Dumplings × 1",
  "Dumpling Selection × 1",
  "Xinjiang Lamb Skewers × 1",
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
