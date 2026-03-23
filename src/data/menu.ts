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
      { name: "Espresso", price: 2500, priceDouble: 3400 },
      { name: "Americano", price: 3000, priceDouble: 3400 },
      { name: "Cortado", price: 3200, priceDouble: 3400 },
      { name: "Capuccino", price: 3500, priceDouble: 3700 },
      { name: "Latte", price: 3700, priceDouble: 4000 },
      { name: "Mokaccino", price: 4000, priceDouble: 4250 },
      { name: "Descafeinado", price: 4500, priceDouble: 4500 },
      { name: "Infusiones", price: 2500 },
    ],
  },
  {
    id: "bebidasfrias",
    name: "Bebidas Frías",
    emoji: "🧃",
    items: [
      { name: "Bebidas en Lata", price: 1800 },
      { name: "Agua Mineral", price: 1000 },
      { name: "Kombucha", price: 3000 },
      { name: "Vitamin Water", price: 2500 },
      { name: "Red Bull", price: 3500 },
    ],
  },
  {
    id: "jugos",
    name: "Jugos Naturales",
    emoji: "🍊",
    items: [
      { name: "Jugo de Naranja", price: 2500 },
      { name: "Jugo de Manzana", price: 2500 },
      { name: "Agua con Jengibre", price: 2000 },
    ],
  },
  {
    id: "dulces",
    name: "Dulces",
    emoji: "🍰",
    items: [
      { name: "Media Lunas", price: 1500, unit: "2 unidades" },
      { name: "Kuchen", price: 3500 },
      { name: "Tarta del Día", price: 4500 },
      { name: "Pie de Limón", price: 3500 },
      { name: "Torta de Nuez", price: 3000 },
      { name: "Muffin Chocolate", price: 2000 },
      { name: "Muffin Arándano", price: 2000 },
      { name: "Donuts", price: 1500 },
      { name: "Mini Donuts", price: 2000, unit: "3 unidades" },
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
      { name: "Sandwich Miga Ave Palta", price: 4700 },
      { name: "Sandwich Miga Huevo-Ciboulette", price: 4000 },
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
        description: "Café o té + Croissant Jamón-Queso",
        price: 5900,
      },
      {
        name: "Proteico",
        description: "Yogurt + Manzana o Plátano + Granola + Jugo de Naranja",
        price: 6500,
      },
      {
        name: "Brunch",
        description: "Café o té + Jugo de Naranja + Paila de Huevos",
        price: 7500,
      },
      {
        name: "Full",
        description: "Café o té + Jugo de Naranja + Paila de Huevos + Palta",
        price: 9000,
      },
    ],
  },
]

export const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-CL")}`
