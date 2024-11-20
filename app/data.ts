import { Budget } from "@/type";

const budgets: Budget[] = [
  {
    id: "1",
    createdAt: new Date("2024-01-10"),
    name: "Feeding",
    amount: 50000,
    emoji: "🍎",
    transactions: [
      {
        id: "t1",
        amount: 12000,
        emoji: "🍕",
        description: "Pizzeria",
        createdAt: new Date("2024-01-12"),
        budgetName: "Feeding",
        budgetId: "1",
      },
      {
        id: "t2",
        amount: 23000,
        emoji: "🍞",
        description: "Boulangerie",
        createdAt: new Date("2024-01-15"),
        budgetName: "Feeding",
        budgetId: "1",
      },
    ],
  },
  {
    id: "2",
    createdAt: new Date("2024-01-05"),
    name: "Transport",
    amount: 30000,
    emoji: "🚗",
    transactions: [
      {
        id: "t3",
        amount: 16000,
        emoji: "⛽",
        description: "Gaz",
        createdAt: new Date("2024-01-08"),
        budgetName: "Transport",
        budgetId: "2",
      },
      {
        id: "t4",
        amount: 7500,
        emoji: "🚕",
        description: "Taxi",
        createdAt: new Date("2024-01-20"),
        budgetName: "Transport",
        budgetId: "2",
      },
    ],
  },
  {
    id: "3",
    createdAt: new Date("2024-02-01"),
    name: "Pleasure",
    amount: 20000,
    emoji: "🎉",
    transactions: [
      {
        id: "t5",
        amount: 4000,
        emoji: "🎬",
        description: "Cinema",
        createdAt: new Date("2024-02-03"),
        budgetName: "Pleasure",
        budgetId: "3",
      },
    ],
  },
  {
    id: "4",
    createdAt: new Date("2024-02-15"),
    name: "Health",
    amount: 15000,
    emoji: "💊",
    transactions: [
      {
        id: "t6",
        amount: 4500,
        emoji: "🏥",
        description: "Medical Consultation",
        createdAt: new Date("2024-02-17"),
        budgetName: "Health",
        budgetId: "4",
      },
    ],
  },
  {
    id: "5",
    createdAt: new Date("2024-03-01"),
    name: "Education",
    amount: 400000,
    emoji: "📚",
    transactions: [
      {
        id: "t7",
        amount: 100000,
        emoji: "📖",
        description: "Harvard Uni Certifications",
        createdAt: new Date("2024-03-05"),
        budgetName: "Education",
        budgetId: "5",
      },
    ],
  },
  {
    id: "6",
    createdAt: new Date("2024-04-01"),
    name: "Home",
    amount: 60000,
    emoji: "🏠",
    transactions: [
      {
        id: "t8",
        amount: 25000,
        emoji: "🛋️",
        description: "Furnitures",
        createdAt: new Date("2024-04-10"),
        budgetName: "Home",
        budgetId: "6",
      },
    ],
  },
];

export default budgets;