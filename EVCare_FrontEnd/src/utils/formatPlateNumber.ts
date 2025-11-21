export const formatPlateNumber = (plate: string) => {
  if (plate.length !== 8) return plate;

  const part1 = plate.slice(0, 3);
  const part2 = plate.slice(3, 6);
  const part3 = plate.slice(6, 8);

  return `${part1}-${part2}.${part3}`;
};
