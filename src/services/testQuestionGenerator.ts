import type { Question, Difficulty } from "../types";
import { generateGeminiQuestions } from "./geminiService";

interface GenerateOptions {
  topic: string;
  difficulty: Difficulty;
  count: number;
}

// 1. Strictly isolated offline database by subject topic
export const OFFLINE_QUESTION_BANKS: Record<string, Question[]> = {
  // --- History (World History, Timelines, Revolutions) ---
  "History": [
    {
      id: "hist_1",
      topic: "History",
      type: "mcq",
      prompt: "In which year did the French Revolution officially begin with the storming of the Bastille?",
      options: ["1789", "1776", "1804", "1815"],
      correctAnswer: "1789",
      solutionSteps: [
        "The Storming of the Bastille took place on 14 July 1789 in Paris, France.",
        "It marked a crucial flashpoint and symbol of the collapse of the Ancien Regime."
      ],
      marks: 4
    },
    {
      id: "hist_2",
      topic: "History",
      type: "short_answer",
      prompt: "Which ancient civilization constructed the Great Pyramid of Giza? (Enter one word)",
      correctAnswer: "Egyptians",
      solutionSteps: [
        "The Great Pyramid was built by the Ancient Egyptians during the Fourth Dynasty for Pharaoh Khufu.",
        "It was completed around 2560 BCE."
      ],
      marks: 6
    },
    {
      id: "hist_3",
      topic: "History",
      type: "mcq",
      prompt: "Who was the first Emperor of a unified China and founder of the Qin Dynasty?",
      options: ["Qin Shi Huang", "Kublai Khan", "Sun Yat-sen", "Emperor Wu of Han"],
      correctAnswer: "Qin Shi Huang",
      solutionSteps: [
        "Qin Shi Huang conquered all rival Warring States and unified China in 221 BCE.",
        "He standardized currency, weights, measures, and initiated the Great Wall."
      ],
      marks: 4
    },
    {
      id: "hist_4",
      topic: "History",
      type: "short_answer",
      prompt: "What year did World War II officially end? (Enter 4-digit year)",
      correctAnswer: "1945",
      solutionSteps: [
        "World War II ended in 1945 following the surrender of Germany in May and Japan in September."
      ],
      marks: 6
    },
    {
      id: "hist_5",
      topic: "History",
      type: "mcq",
      prompt: "The Industrial Revolution first emerged during the 18th century in which country?",
      options: ["Great Britain", "United States", "Germany", "France"],
      correctAnswer: "Great Britain",
      solutionSteps: [
        "Great Britain possessed abundant coal, iron ore, naval trade power, and mechanical inventions like the steam engine that sparked the Industrial Revolution."
      ],
      marks: 4
    },
    {
      id: "hist_6",
      topic: "History",
      type: "short_answer",
      prompt: "Who was the principal author of the United States Declaration of Independence? (Enter full name)",
      correctAnswer: "Thomas Jefferson",
      solutionSteps: [
        "Thomas Jefferson drafted the Declaration in June-July 1776, ratified by the Continental Congress on July 4, 1776."
      ],
      marks: 6
    }
  ],

  // --- Computer Science: Data Structures & Web Development ---
  "Data Structures & Algorithms": [
    {
      id: "dsa_1",
      topic: "Data Structures & Algorithms",
      type: "mcq",
      prompt: "What is the worst-case time complexity of searching for an element in an unsorted singly linked list of length n?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n�)"],
      correctAnswer: "O(n)",
      solutionSteps: [
        "In an unsorted singly linked list, elements are not indexed and there is no direct pointer to arbitrary nodes.",
        "To find an element, you must traverse sequentially from the head pointer node-by-node.",
        "In the worst case, the target element is at the end of the list or not present at all, requiring n checks: O(n)."
      ],
      marks: 4
    },
    {
      id: "dsa_2",
      topic: "Data Structures & Algorithms",
      type: "mcq",
      prompt: "In a complete Binary Search Tree (BST), what is the average time complexity for insertion and lookup operations?",
      options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
      correctAnswer: "O(log n)",
      solutionSteps: [
        "A balanced BST splits the remaining search space roughly in half at each node comparison.",
        "The height of a balanced tree with n nodes is proportional to log2(n).",
        "Hence, search and insert operations take O(log n) time on average."
      ],
      marks: 4
    },
    {
      id: "dsa_3",
      topic: "Data Structures & Algorithms",
      type: "short_answer",
      prompt: "What data structure operates under the LIFO (Last-In, First-Out) principle? (Enter one word)",
      correctAnswer: "Stack",
      solutionSteps: [
        "A Stack adds items to the top and removes items from the top.",
        "The most recently added element is always the first one popped, following Last-In First-Out (LIFO)."
      ],
      marks: 6
    },
    {
      id: "dsa_4",
      topic: "Data Structures & Algorithms",
      type: "mcq",
      prompt: "Which sorting algorithm has a guaranteed worst-case time complexity of O(n log n)?",
      options: ["MergeSort", "QuickSort", "BubbleSort", "InsertionSort"],
      correctAnswer: "MergeSort",
      solutionSteps: [
        "MergeSort always divides the array into two halves (log n levels) and merges them in linear O(n) time.",
        "Regardless of the initial ordering of data, MergeSort remains O(n log n) even in the worst case."
      ],
      marks: 4
    },
    {
      id: "dsa_5",
      topic: "Data Structures & Algorithms",
      type: "short_answer",
      prompt: "What is the average time complexity of looking up a key in a well-distributed Hash Map? (Enter e.g. O(1), O(n), etc.)",
      correctAnswer: "O(1)",
      solutionSteps: [
        "A hash function computes an array index directly from the key in constant time.",
        "With a good hash function and proper load factor, collisions are rare, giving average lookup time of O(1)."
      ],
      marks: 6
    },
    {
      id: "dsa_6",
      topic: "Data Structures & Algorithms",
      type: "mcq",
      prompt: "Which HTML tag is used to create an interactive hyperlink to another web page or resource?",
      options: ["<a>", "<link>", "<href>", "<button>"],
      correctAnswer: "<a>",
      solutionSteps: [
        "The anchor tag <a> with the href attribute specifies the destination URL for hyperlinks in HTML."
      ],
      marks: 4
    }
  ],

  // --- Mathematics: Calculus, Algebra, and Logic ---
  "Calculus & Differential Equations": [
    {
      id: "calc_1",
      topic: "Calculus & Differential Equations",
      type: "mcq",
      prompt: "What is the derivative of f(x) = 3x^3 - 5x + 7 with respect to x?",
      options: ["9x^2 - 5", "6x^2 - 5x", "9x^3 - 5", "3x^2 - 5"],
      correctAnswer: "9x^2 - 5",
      solutionSteps: [
        "Apply the Power Rule: d/dx [x^n] = n * x^(n-1).",
        "d/dx [3x^3] = 3 * 3x^2 = 9x^2.",
        "d/dx [-5x] = -5.",
        "d/dx [7] = 0 (constant derivative is zero).",
        "Combine the terms: 9x^2 - 5."
      ],
      marks: 4
    },
    {
      id: "calc_2",
      topic: "Calculus & Differential Equations",
      type: "short_answer",
      prompt: "Evaluate the definite integral: ? from 0 to 2 of (4x + 3) dx. (Enter exact numerical answer)",
      correctAnswer: "14",
      solutionSteps: [
        "Find the antiderivative: F(x) = ?(4x + 3) dx = 2x^2 + 3x.",
        "Evaluate upper limit F(2): 2(2)^2 + 3(2) = 2(4) + 6 = 8 + 6 = 14.",
        "Evaluate lower limit F(0): 2(0)^2 + 3(0) = 0.",
        "Compute F(2) - F(0) = 14 - 0 = 14."
      ],
      marks: 6
    },
    {
      id: "calc_3",
      topic: "Calculus & Differential Equations",
      type: "mcq",
      prompt: "What is the limit of (sin x) / x as x approaches 0?",
      options: ["1", "0", "Undefined", "Infinity"],
      correctAnswer: "1",
      solutionSteps: [
        "This is a fundamental calculus trigonometric limit.",
        "Can be demonstrated using L'Hopital's rule: d/dx[sin x] / d/dx[x] = cos(0)/1 = 1/1 = 1."
      ],
      marks: 4
    },
    {
      id: "calc_4",
      topic: "Calculus & Differential Equations",
      type: "short_answer",
      prompt: "If x^2 - 7x + 12 = 0, what is the product of the roots? (Enter number)",
      correctAnswer: "12",
      solutionSteps: [
        "By Vieta's formulas, product of roots in ax^2 + bx + c = 0 is c/a = 12/1 = 12."
      ],
      marks: 6
    },
    {
      id: "calc_5",
      topic: "Calculus & Differential Equations",
      type: "mcq",
      prompt: "What is the indefinite integral of 1/x with respect to x for x > 0?",
      options: ["ln(x) + C", "-1/x^2 + C", "x + C", "e^x + C"],
      correctAnswer: "ln(x) + C",
      solutionSteps: [
        "By definition of the natural logarithm derivative, d/dx [ln x] = 1/x.",
        "Therefore, ? (1/x) dx = ln(x) + C."
      ],
      marks: 4
    }
  ],

  // --- Physics: Classical Mechanics & Kinematics ---
  "Classical Mechanics & Kinematics": [
    {
      id: "mech_1",
      topic: "Classical Mechanics & Kinematics",
      type: "mcq",
      prompt: "A car accelerates uniformly from rest to 20 m/s in 5 seconds. What is the acceleration?",
      options: ["4 m/s�", "2 m/s�", "5 m/s�", "100 m/s�"],
      correctAnswer: "4 m/s�",
      solutionSteps: [
        "Use kinematics formula: v = u + at.",
        "Given initial velocity u = 0 m/s, final velocity v = 20 m/s, time t = 5 s.",
        "a = (v - u) / t = (20 - 0) / 5 = 4 m/s�."
      ],
      marks: 4
    },
    {
      id: "mech_2",
      topic: "Classical Mechanics & Kinematics",
      type: "short_answer",
      prompt: "A 2 kg mass is pushed horizontally with a net force of 18 N. Calculate the resulting acceleration in m/s�. (Enter number)",
      correctAnswer: "9",
      solutionSteps: [
        "Apply Newton's Second Law: F = m * a.",
        "Rearrange for acceleration: a = F / m.",
        "a = 18 N / 2 kg = 9 m/s�."
      ],
      marks: 6
    },
    {
      id: "mech_3",
      topic: "Classical Mechanics & Kinematics",
      type: "mcq",
      prompt: "What principle explains why a spinning ice skater rotates faster when pulling their arms inward?",
      options: [
        "Conservation of Angular Momentum",
        "Conservation of Linear Momentum",
        "Bernoulli's Principle",
        "Archimedes' Principle"
      ],
      correctAnswer: "Conservation of Angular Momentum",
      solutionSteps: [
        "Angular momentum L = I * ? (moment of inertia * angular velocity).",
        "Pulling arms inward reduces the moment of inertia I.",
        "Because no external torque acts, L must remain constant, forcing angular velocity ? to increase."
      ],
      marks: 4
    },
    {
      id: "mech_4",
      topic: "Classical Mechanics & Kinematics",
      type: "short_answer",
      prompt: "Calculate the kinetic energy (in Joules) of an object with mass 4 kg moving at 5 m/s. (Enter number)",
      correctAnswer: "50",
      solutionSteps: [
        "Kinetic energy formula: KE = 0.5 * m * v�.",
        "KE = 0.5 * 4 * (5)� = 2 * 25 = 50 Joules."
      ],
      marks: 6
    }
  ],

  // --- Chemistry & Biology: Organic Chemistry & Cell Bio ---
  "Organic Chemistry & Cell Bio": [
    {
      id: "bio_1",
      topic: "Organic Chemistry & Cell Bio",
      type: "mcq",
      prompt: "What cellular organelle is primarily responsible for ATP synthesis in eukaryotic cells?",
      options: ["Mitochondria", "Ribosome", "Golgi apparatus", "Lysosome"],
      correctAnswer: "Mitochondria",
      solutionSteps: [
        "Mitochondria carry out the Krebs cycle and oxidative phosphorylation via the electron transport chain.",
        "This generates the vast majority of cellular ATP."
      ],
      marks: 4
    },
    {
      id: "bio_2",
      topic: "Organic Chemistry & Cell Bio",
      type: "short_answer",
      prompt: "In chemistry, what is the pH value of pure neutral water at 25�C? (Enter single digit)",
      correctAnswer: "7",
      solutionSteps: [
        "Pure water self-ionizes: Kw = [H+][OH-] = 1.0 x 10^-14 at 25�C.",
        "In neutral water, [H+] = [OH-] = 1.0 x 10^-7 M.",
        "pH = -log10[1.0 x 10^-7] = 7."
      ],
      marks: 6
    },
    {
      id: "bio_3",
      topic: "Organic Chemistry & Cell Bio",
      type: "mcq",
      prompt: "Which functional group characterizes alcohols in organic chemistry?",
      options: ["Hydroxyl group (-OH)", "Carbonyl group (C=O)", "Carboxyl group (-COOH)", "Amino group (-NH2)"],
      correctAnswer: "Hydroxyl group (-OH)",
      solutionSteps: [
        "Alcohols are organic compounds where one or more hydroxyl (-OH) groups are bonded to a saturated carbon atom."
      ],
      marks: 4
    },
    {
      id: "bio_4",
      topic: "Organic Chemistry & Cell Bio",
      type: "short_answer",
      prompt: "How many carbon atoms are in a single molecule of glucose (C6H12O6)? (Enter number)",
      correctAnswer: "6",
      solutionSteps: [
        "The chemical formula of glucose is C6H12O6.",
        "The subscript next to carbon (C) is 6, meaning there are 6 carbon atoms per molecule."
      ],
      marks: 6
    }
  ],

  // --- Economics: Microeconomics & Market Analysis ---
  "Microeconomics & Market Analysis": [
    {
      id: "econ_1",
      topic: "Microeconomics & Market Analysis",
      type: "mcq",
      prompt: "According to the Law of Demand, what happens to the quantity demanded of a normal good when its price increases, holding other factors constant?",
      options: [
        "Quantity demanded decreases",
        "Quantity demanded increases",
        "Quantity demanded remains constant",
        "The entire demand curve shifts to the right"
      ],
      correctAnswer: "Quantity demanded decreases",
      solutionSteps: [
        "The Law of Demand states that price and quantity demanded have an inverse relationship (ceteris paribus).",
        "As price rises, consumers buy less of that good."
      ],
      marks: 4
    },
    {
      id: "econ_2",
      topic: "Microeconomics & Market Analysis",
      type: "short_answer",
      prompt: "What term describes the value of the next best alternative foregone when a choice is made? (Enter two words)",
      correctAnswer: "Opportunity cost",
      solutionSteps: [
        "Opportunity cost represents the potential benefits missed out on when choosing one alternative over another."
      ],
      marks: 6
    },
    {
      id: "econ_3",
      topic: "Microeconomics & Market Analysis",
      type: "mcq",
      prompt: "In a perfectly competitive market, firms are price takers. What is the firm's marginal revenue equal to?",
      options: ["Market Price (P)", "Total Revenue (TR)", "Average Fixed Cost (AFC)", "Zero"],
      correctAnswer: "Market Price (P)",
      solutionSteps: [
        "In perfect competition, an individual firm can sell any quantity at the market price.",
        "Thus MR = P."
      ],
      marks: 4
    },
    {
      id: "econ_4",
      topic: "Microeconomics & Market Analysis",
      type: "short_answer",
      prompt: "If a 10% increase in price leads to a 20% decrease in quantity demanded, what is the absolute value of price elasticity of demand? (Enter number)",
      correctAnswer: "2",
      solutionSteps: [
        "Price Elasticity of Demand (PED) = |-20% / 10%| = 2.",
        "Since PED > 1, demand is elastic."
      ],
      marks: 6
    }
  ]
};

/**
 * High-quality offline fallback generator for user-specified custom subjects
 */
function getOfflineQuestionsForTopic(topic: string, count: number, difficulty: Difficulty): Question[] {
  const norm = topic.toLowerCase();
  let baseBank: Question[];

  if (norm.includes("history") || norm.includes("war") || norm.includes("revolution") || norm.includes("civilization")) {
    baseBank = OFFLINE_QUESTION_BANKS["History"];
  } else if (norm.includes("data structure") || norm.includes("algorithm") || norm.includes("programming") || norm.includes("computer") || norm.includes("software") || norm.includes("web")) {
    baseBank = OFFLINE_QUESTION_BANKS["Data Structures & Algorithms"];
  } else if (norm.includes("calculus") || norm.includes("math") || norm.includes("algebra") || norm.includes("equation") || norm.includes("integral")) {
    baseBank = OFFLINE_QUESTION_BANKS["Calculus & Differential Equations"];
  } else if (norm.includes("physic") || norm.includes("mechanic") || norm.includes("kinematic") || norm.includes("motion") || norm.includes("force")) {
    baseBank = OFFLINE_QUESTION_BANKS["Classical Mechanics & Kinematics"];
  } else if (norm.includes("chem") || norm.includes("bio") || norm.includes("cell") || norm.includes("organic") || norm.includes("plant")) {
    baseBank = OFFLINE_QUESTION_BANKS["Organic Chemistry & Cell Bio"];
  } else if (norm.includes("econ") || norm.includes("market") || norm.includes("finance") || norm.includes("trade") || norm.includes("business")) {
    baseBank = OFFLINE_QUESTION_BANKS["Microeconomics & Market Analysis"];
  } else {
    // If not matching any keyword, return History as a safe, highly general academic subject rather than broken science templates
    baseBank = OFFLINE_QUESTION_BANKS["History"];
  }

  const result: Question[] = [];
  for (let i = 0; i < count; i++) {
    const template = baseBank[i % baseBank.length];
    result.push({
      ...template,
      id: `offline_${template.id}_${i + 1}`,
      topic: topic, // Strictly tagged with user's requested topic name
      marks: difficulty === "Hard" ? template.marks + 2 : template.marks
    });
  }

  return result;
}

/**
 * Hybrid Question Generator:
 * 1. Checks embedded Gemini AI client first for unlimited dynamic generation.
 * 2. If Gemini key is empty, fails, or is rate-limited, drops back to clean local database.
 */
export async function generateQuestionsForTestAsync({
  topic,
  difficulty,
  count
}: GenerateOptions): Promise<Question[]> {
  try {
    const aiQuestions = await generateGeminiQuestions(topic, difficulty, count);
    if (aiQuestions && aiQuestions.length === count) {
      return aiQuestions;
    }
  } catch (err) {
    console.warn("AI generation bypassed, proceeding with local offline bank:", err);
  }

  return getOfflineQuestionsForTopic(topic, count, difficulty);
}

/**
 * Synchronous local question generator for instant offline rendering
 */
export function generateQuestionsForTest({
  topic,
  difficulty,
  count
}: GenerateOptions): Question[] {
  return getOfflineQuestionsForTopic(topic, count, difficulty);
}
