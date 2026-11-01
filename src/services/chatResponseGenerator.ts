import { askGeminiStudyAssistant } from "./geminiService";

/**
 * High-quality offline database of direct explanations.
 * All responses start with a direct answer in sentence 1 and use simple everyday analogies.
 */
function getOfflineStudyResponse(prompt: string): string {
  const p = prompt.trim().toLowerCase();

  // 1. History
  if (p.includes("history") || p.includes("french revolution") || p.includes("bastille") || p.includes("world war")) {
    return `The French Revolution began in 1789 when the people of Paris stormed the Bastille prison to overthrow absolute royal monarchy and feudal privileges.

Think of it like a pressure cooker where the king and aristocracy held all the wealth and paid almost zero taxes while everyday working citizens starved under rising bread prices. When the pressure became unbearable, citizens rebelled to establish liberty, equality, and democratic human rights that reshaped governments across the modern world.`;
  }

  // 2. Calculus: Derivative
  if (p.includes("derivative") || p.includes("differentiat")) {
    return `A derivative measures how quickly a quantity is changing at any single instant, which is just the slope of a curve at that exact point.

Think of it like looking at a speedometer in a car. While your average speed might be 50 miles per hour over an entire road trip, the speedometer tells you your derivative�your exact rate of change at that single second. If you have a curve like y = x�, the derivative 2x tells you how steep the hill is wherever you stand along the curve.`;
  }

  // 3. Calculus: Integral
  if (p.includes("integral") || p.includes("integrat")) {
    return `An integral calculates the accumulated total of something by adding up countless microscopic pieces, which is also the area under a graph curve.

Imagine filling up a bathtub where the faucet keeps changing its flow from a trickle to a blast. If you plot the rate of water flow over time, taking the integral adds up all those varying drops to give you the exact total amount of water in the tub. In geometry, integration slices a curvy shape into infinitely thin vertical strips and sums them up into a complete area.`;
  }

  // 4. Mathematics: Quadratic Equations
  if (p.includes("quadratic") || p.includes("parabola") || p.includes("roots")) {
    return `A quadratic equation is a polynomial equation where the highest exponent is two, forming a symmetrical U-shaped curve called a parabola.

Whenever you throw a ball into the air, its arc goes up, reaches a peak, and drops back down; that trajectory follows a quadratic curve. The roots or solutions of the equation are simply the points where the path touches the ground (where y equals zero). You can find those points using factoring, completing the square, or the standard quadratic formula.`;
  }

  // 5. Mathematics: Matrices & Linear Algebra
  if (p.includes("matrix") || p.includes("determinant") || p.includes("linear algebra")) {
    return `A matrix is a grid of numbers used to represent, transform, and solve systems of linear equations simultaneously.

You can think of a matrix as an instruction sheet that tells a computer how to stretch, rotate, or slide a 2D or 3D object on a screen. The determinant tells you by how much that transformation scales the area or volume, and if the determinant is zero, it means the shape has been completely squashed flat, which is why that matrix cannot be reversed or inverted.`;
  }

  // 6. Computer Science: Algorithms & Big-O
  if (p.includes("big-o") || p.includes("complexity") || p.includes("quicksort") || p.includes("sorting") || p.includes("algorithm")) {
    return `Big-O notation describes how much longer an algorithm takes to run or how much memory it needs as the amount of input data grows.

If you are looking for a name in an unsorted pile of 100 papers, you might have to check each page one by one, which is linear time. If the pile grows to one million papers, that same linear approach takes one million steps. Faster algorithms like binary search or quicksort divide problems in half repeatedly, letting computers find answers in just a few dozen steps even with millions of records.`;
  }

  // 7. Computer Science: Data Structures (Stack / Queue / Trees)
  if (p.includes("stack") || p.includes("queue") || p.includes("linked list") || p.includes("binary tree")) {
    return `A data structure is a specialized way of organizing and storing information in a computer so it can be accessed and modified efficiently.

A stack is like a stack of plates where you can only take the top plate off first (Last-In, First-Out). A queue is like a line of people waiting for a ticket where the first person in line gets served first (First-In, First-Out). Choosing the right data structure makes computer programs run millions of times faster.`;
  }

  // 8. Physics: Velocity vs Acceleration
  if (p.includes("velocity") || p.includes("acceleration") || p.includes("speed")) {
    return `Velocity is the speed of an object in a specific direction, while acceleration is the rate at which that velocity is speeding up, slowing down, or turning.

If you set cruise control on a straight highway at 60 miles per hour north, your velocity is 60 miles per hour north and your acceleration is zero because your speed is steady. The moment you step on the gas pedal or hit the brakes, you are accelerating because your velocity is actively changing.`;
  }

  // 9. Physics: Newton's Laws / Force
  if (p.includes("newton") || p.includes("force") || (p.includes("mass") && p.includes("acceleration"))) {
    return `A force is a push or a pull on an object that causes it to change its state of motion, calculated as mass multiplied by acceleration.

Newton's Second Law means that pushing a heavy object requires much more effort to get it moving than pushing a light one. If you push an empty shopping cart and a cart filled with cement bags with the exact same amount of muscle, the empty cart shoots forward quickly while the heavy cart barely creeps forward because greater mass resists changes in motion.`;
  }

  // 10. Biology: Photosynthesis
  if (p.includes("photosynthesis")) {
    return `Photosynthesis is the chemical process by which green plants use sunlight, water, and carbon dioxide to create sugars for food and release oxygen into the air.

Plants act like solar-powered bakeries. Their leaves absorb water from the soil through roots and catch carbon dioxide from the air through tiny pores. Chlorophyll inside the plant traps energy from sunbeams to stir these ingredients together, baking glucose sugar for the plant to grow while releasing clean oxygen as a byproduct.`;
  }

  // 11. Chemistry: Acids, Bases, and pH
  if (p.includes("ph") || p.includes("acid") || p.includes("base")) {
    return `The pH scale measures how acidic or basic a water-based solution is on a scale from 0 to 14, where 7 is completely neutral.

Pure water sits right at 7. Solutions with a pH lower than 7 have an excess of hydrogen ions and taste sour or sharp, like lemon juice or vinegar. Solutions with a pH higher than 7 have fewer free hydrogen ions and feel slippery, like soap or baking soda. Because the scale is logarithmic, every single step represents a tenfold change in acidity.`;
  }

  // 12. General academic fallback
  return `To understand ${prompt.length > 50 ? "this concept" : prompt.replace(/[?.]+$/, "")}, look at its central governing rule: one variable changes directly because another force or condition triggers it.

Think of it in terms of cause and effect: whenever you change the input or starting condition, the system responds systematically according to conservation principles. Breaking the topic into starting conditions and final outcomes makes the solution straightforward and intuitive.`;
}

/**
 * Hybrid Chat Generator:
 * Tries embedded Gemini API first. If key is empty or call fails, returns offline direct explanation instantly.
 */
export async function generateDirectStudyResponseAsync(prompt: string): Promise<string> {
  try {
    const aiResponse = await askGeminiStudyAssistant(prompt);
    if (aiResponse && aiResponse.trim().length > 0) {
      return aiResponse.trim();
    }
  } catch (err) {
    console.warn("Gemini chat failed, using local offline generator:", err);
  }

  return getOfflineStudyResponse(prompt);
}

export function generateDirectStudyResponse(prompt: string): string {
  return getOfflineStudyResponse(prompt);
}
