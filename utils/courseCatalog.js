const courseCatalog = [
  {
    id: "fin-001",
    title: "Financial Literacy Basics",
    category: "Financial Literacy",
    description: "Master the basics of cash flow, budgeting, and profit tracking for your business.",
    modules: [
      {
        id: "mod-1",
        title: "Understanding Cash Flow",
        lessons: [
          {
            id: "les-1",
            title: "Inflows and Outflows",
            content: "Cash flow is the lifeblood of your business. It refers to the money coming in (inflows) from sales and the money going out (outflows) for expenses. To keep your business healthy, your inflows must exceed your outflows over time. A common mistake is confusing 'profit' with 'cash flow'—you might be profitable on paper but still run out of cash to pay bills today. Always track your daily and weekly cash position.",
          },
          {
            id: "les-2",
            title: "The Importance of an Emergency Fund",
            content: "Business is unpredictable. Sales might dip, or a key piece of equipment might break. An emergency fund is a cash reserve (usually 3-6 months of operating expenses) set aside for these exact situations. It prevents you from taking high-interest loans in a crisis. Start small—save 5% of your weekly profit until you build a comfortable buffer.",
          }
        ],
        quiz: {
          id: "quiz-1",
          questions: [
            {
              question: "What is the primary difference between cash flow and profit?",
              options: [
                "They are exactly the same thing.",
                "Cash flow is about timing of money moving in and out, while profit is revenue minus expenses over a period.",
                "Profit only applies to large corporations."
              ],
              correctIndex: 1
            },
            {
              question: "How many months of operating expenses should typically be in an emergency fund?",
              options: ["1 month", "3-6 months", "12-24 months"],
              correctIndex: 1
            }
          ]
        }
      }
    ]
  },
  {
    id: "gov-001",
    title: "Navigating Government Schemes",
    category: "Government Schemes",
    description: "Learn how to find, apply, and qualify for government support programs.",
    modules: [
      {
        id: "mod-1",
        title: "Introduction to Support Schemes",
        lessons: [
          {
            id: "les-1",
            title: "What are Government Schemes?",
            content: "Government schemes are initiatives launched by the state or central government to support citizens. For entrepreneurs, these often include subsidized loans, grants, or training programs. Key schemes for women include the Mudra Yojana, Stand-Up India, and state-specific Mahila Samriddhi Yojanas.",
          }
        ],
        quiz: {
          id: "quiz-1",
          questions: [
            {
              question: "Which of the following is a common type of government support for entrepreneurs?",
              options: ["Free raw materials for life", "Subsidized loans and grants", "Guaranteed customer base"],
              correctIndex: 1
            }
          ]
        }
      }
    ]
  },
  {
    id: "dig-001",
    title: "Digital Marketing 101",
    category: "Digital Skills",
    description: "Expand your reach using social media, WhatsApp Business, and online marketplaces.",
    modules: [
      {
        id: "mod-1",
        title: "Social Media Presence",
        lessons: [
          {
            id: "les-1",
            title: "Using WhatsApp Business",
            content: "WhatsApp Business allows you to create a professional profile, set up a product catalog, and automate responses. It is one of the most direct and trusted ways to communicate with local customers.",
          }
        ],
        quiz: {
          id: "quiz-1",
          questions: [
            {
              question: "What is a key feature of WhatsApp Business?",
              options: ["Playing games with customers", "Setting up a product catalog", "Watching movies"],
              correctIndex: 1
            }
          ]
        }
      }
    ]
  }
];

module.exports = { courseCatalog };
