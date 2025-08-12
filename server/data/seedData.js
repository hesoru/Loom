const sizes = {
  'Tees & Tops': ['XS', 'S', 'M', 'L', 'XL'],
  'Pants': ['28', '30', '32', '34', '36'],
  'Dresses': ['XS', 'S', 'M', 'L', 'XL'],
  'Skirts': ['XS', 'S', 'M', 'L', 'XL']
};

const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    description: "Essential cotton crew neck t-shirt in pure white.",
    price: 29.99,
    category: "Tees & Tops",
    image: "https://images.unsplash.com/photo-1672603145592-f013b5ff29bd?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availableSizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    name: "Light Blue Shirt",
    description: "Cotton blue shirt with a button-down collar.",
    price: 44.99,
    category: "Tees & Tops",
    image: "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availableSizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 3,
    name: "Slim Fit Jeans",
    description: "Classic blue slim fit denim jeans.",
    price: 59.99,
    category: "Pants",
    image: "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availableSizes: ['28', '30', '32', '34', '36']
  },
  {
    id: 4,
    name: "Black Chinos",
    description: "Comfortable tapered chinos for the office.",
    price: 64.99,
    category: "Pants",
    image: "https://images.unsplash.com/photo-1584865288642-42078afe6942?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availableSizes: ['28', '30', '32', '34', '36']
  },
  {
    id: 5,
    name: "Summer Floral Dress",
    description: "Light and breezy floral print summer dress.",
    price: 89.99,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1944&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availableSizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 6,
    name: "Pleated Midi Skirt",
    description: "Elegant pleated midi skirt in navy blue.",
    price: 69.99,
    category: "Skirts",
    image: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availableSizes: ['XS', 'S', 'M', 'L', 'XL']
  }
];

module.exports = {
  sizes,
  products
};
