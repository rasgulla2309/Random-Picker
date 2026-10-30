/**
 * randomPicker.js - Cryptographically fair random student selection
 */

/**
 * Select one random student from an array using crypto.getRandomValues
 * This ensures true randomness without Math.random bias.
 * @param {Array} pool - Array of eligible students
 * @returns {*} - Selected student
 */
export function cryptoRandomPick(pool) {
  if (!pool || pool.length === 0) {
    throw new Error('No eligible students in pool');
  }
  if (pool.length === 1) return pool[0];

  // Use rejection sampling to avoid modulo bias
  const max = pool.length;
  const limit = Math.floor(0xFFFFFFFF / max) * max;
  
  let randomIndex;
  do {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    randomIndex = randomBuffer[0];
  } while (randomIndex >= limit);

  return pool[randomIndex % max];
}

/**
 * Shuffle array using Fisher-Yates with crypto random
 * @param {Array} arr - Array to shuffle
 * @returns {Array} - New shuffled array
 */
export function cryptoShuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    const j = randomBuffer[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
