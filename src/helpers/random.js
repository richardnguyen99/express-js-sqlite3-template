"use strict";

/**
 * Returns a random integer between the specified values.
 *
 * @param {number} [min=1] - The minimum value of the random integer (default: `1`).
 * @param {number} [max=100] - The maximum value of the random integer (default: `100`).
 * @returns {number} The randomized integer
 */
function randomInt(min = 1, max = 100) {
  if (typeof min !== "number" || typeof max !== "number") {
    throw new TypeError("The value must be a number.");
  }

  if (min > max) {
    throw new Error(
      "The minimum value cannot be greater than the maximum value."
    );
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return NaN;
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.randomInt = randomInt;
