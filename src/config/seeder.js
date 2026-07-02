require("dotenv").config();

const connectDB = require("./db")
const MenuItem = require("../models/MenuItem");

const menu = [
  {
    menuIndex: 1,
    name: "Jollof Rice",
    category: "Main Dish",
    price: 1500,
    description: "Party-style smoky jollof rice",
  },
  {
    menuIndex: 2,
    name: "Fried Rice",
    category: "Main Dish",
    price: 1500,
    description: "Nigerian-style fried rice with mixed vegetables",
  },
  {
    menuIndex: 3,
    name: "Pounded Yam & Egusi",
    category: "Main Dish",
    price: 2000,
    description: "Smooth pounded yam with rich egusi soup",
  },
  {
    menuIndex: 4,
    name: "Amala & Ewedu",
    category: "Main Dish",
    price: 1800,
    description: "Soft amala served with ewedu and gbegiri",
  },
  {
    menuIndex: 5,
    name: "Ofada Rice & Stew",
    category: "Main Dish",
    price: 2000,
    description: "Local ofada rice with designer stew",
  },

  {
    menuIndex: 6,
    name: "Moi Moi",
    category: "Side",
    price: 500,
    description: "Steamed bean pudding with egg and fish",
  },
  {
    menuIndex: 7,
    name: "Fried Plantain (Dodo)",
    category: "Side",
    price: 400,
    description: "Sweet ripe plantain, golden fried",
  },
  {
    menuIndex: 8,
    name: "Peppered Gizzard",
    category: "Side",
    price: 1000,
    description: "Tender gizzard in spicy pepper sauce",
  },

  {
    menuIndex: 9,
    name: "Zobo",
    category: "Drink",
    price: 300,
    description: "Chilled hibiscus drink with ginger",
  },
  {
    menuIndex: 10,
    name: "Kunu",
    category: "Drink",
    price: 300,
    description: "Creamy millet drink, lightly spiced",
  },
];

connectDB()
  .then(() => {
    return MenuItem.deleteMany({});
  })
  .then(() => {
    return MenuItem.insertMany(menu);
  })
  .then(() => {
    console.log("Menu items seeded successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding menu items:", error);
    process.exit(1);
  });
