export type MenuItem = {
  name: string
  description?: string
  price: number
  priceDouble?: number
  unit?: string
}

export type MenuCategory = {
  id: string
  name: string
  emoji: string
  items: MenuItem[]
}

export const menu: MenuCategory[] = [
  {
    id: "cafe",
    name: "Café",
    emoji: "☕",
    items: [
      { name: "Espresso", price: 2800, priceDouble: 3400 },
      { name: "Americano", price: 3000, priceDouble: 3400 },
      { name: "Cortado", price: 3200, priceDouble: 3500 },
      { name: "Capuccino", price: 3500, priceDouble: 3700 },
      { name: "Latte", price: 3700, priceDouble: 3900 },
      { name: "Latte Vainilla", price: 4000, priceDouble: 4200 },
      { name: "Mococcino", price: 4000, priceDouble: 4200 },
      { name: "Chocolate Caliente", price: 4200, priceDouble: 4400 },
    ],
  },
  {
    id: "infusiones",
    name: "Infusiones",
    emoji: "🍵",
    items: [
      { name: "Té (English Breakfast · Té Verde)", price: 2500 },
      { name: "Manzanilla · Menta", price: 2500 },
    ],
  },
  {
    id: "bebidasfrias",
    name: "Bebidas Frías",
    emoji: "🧃",
    items: [
      { name: "Bebidas en Lata", price: 1500 },
      { name: "Agua Mineral", price: 1000 },
      { name: "Kombucha", price: 3000 },
      { name: "Jugo en Cajita", price: 1500 },
      { name: "Vitamin Water", price: 2000 },
      { name: "Red Bull", price: 2000 },
    ],
  },
  {
    id: "jugos",
    name: "Jugos Naturales",
    emoji: "🍊",
    items: [
      { name: "Jugo Naranja", price: 3000 },
      { name: "Jugo Naranja-Plátano", price: 3500 },
      { name: "Jugo Frambuesa", price: 3500 },
      { name: "Jugo Chirimoya", price: 3500 },
      { name: "Jugo Mango", price: 3500 },
      { name: "Jugo Piña", price: 3500 },
    ],
  },
  {
    id: "extras",
    name: "Extras",
    emoji: "➕",
    items: [
      { name: "Leche", price: 700 },
      { name: "Yogurt Proteína", price: 1000 },
    ],
  },
  {
    id: "dulces",
    name: "Dulces",
    emoji: "🍰",
    items: [
      { name: "Media Lunas", price: 1500, unit: "2 unidades" },
      { name: "Kuchen", price: 3500 },
      { name: "Pie de Limón", price: 3500 },
      { name: "Torta de Nuez", price: 3500 },
      { name: "Muffin Chocolate", price: 2000 },
      { name: "Muffin Arándano", price: 2000 },
      { name: "Donuts", price: 1500 },
    ],
  },
  {
    id: "salados",
    name: "Salados",
    emoji: "🥐",
    items: [
      { name: "Croissant Jamón-Queso", price: 4300 },
      { name: "Panini Queso", price: 4000 },
      { name: "Panini Jamón-Queso", price: 4300 },
      { name: "Panini Jamón-Queso-Tomate", price: 4500 },
      { name: "Tostadas con Palta", price: 5500 },
      { name: "Paila de Huevos", price: 5500 },
    ],
  },
  {
    id: "desayunos",
    name: "Desayunos",
    emoji: "🍳",
    items: [
      {
        name: "Express",
        description: "Café o té a elección + Croissant Jamón-Queso",
        price: 5900,
      },
      {
        name: "Proteico",
        description: "Yogurt + Manzana o Plátano + Granola + Jugo de Naranja",
        price: 6500,
      },
      {
        name: "Brunch",
        description: "Café o té a elección + Jugo de Naranja + Paila de Huevos",
        price: 7500,
      },
      {
        name: "Full",
        description: "Café o té a elección + Jugo de Naranja + Paila de Huevos + Palta",
        price: 9000,
      },
    ],
  },
]

export const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-CL")}`
