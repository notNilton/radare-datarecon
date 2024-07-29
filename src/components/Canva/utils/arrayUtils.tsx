function multiplyArrays(array1: number[], array2: number[]): number[] {
  // Check if the arrays have the same length
  if (array1.length !== array2.length) {
    throw new Error("Arrays must have the same length");
  }

  // Multiply corresponding elements and return a new array
  return array1.map((value, index) => value * array2[index]);
}

export { multiplyArrays };
