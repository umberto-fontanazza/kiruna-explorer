export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Given a typeScript enum produces a comparator which orders the enum values in
 * order of definition
 */
export function enumDefOrderComparator<T extends Record<string, string>>(
  enumType: T,
): (a: T[keyof T], b: T[keyof T]) => number {
  const values = Object.values(enumType);
  const valueOrderMap = new Map(values.map((value, index) => [value, index]));
  return (a, b) => {
    const indexA = valueOrderMap.get(a);
    const indexB = valueOrderMap.get(b);
    if (indexA === undefined || indexB === undefined) {
      throw new Error(`Invalid enum value(s): ${a}, ${b}`);
    }
    return indexA - indexB;
  };
}
