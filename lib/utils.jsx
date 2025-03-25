/**
 * Combines multiple class names into a single string, filtering out falsy values
 * This is a simplified version of the clsx/classnames utility
 * @param {string[]} classes - Class names to be combined
 * @returns {string} - Combined class names
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(" ")
  }
  
  