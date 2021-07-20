export async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function includesCaseInsensitve(array: string[], str: string): boolean {
  let found = false;
  if (Array.isArray(array)) {
    for (let i = 0; i < array.length && !found; i++) {
      found = stringCompare(array[i], str);
    }
  }
  return found;
}

export function stringCompare(a: string, b: string) {
  return typeof a === 'string' && typeof b === 'string'
    ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
    : a === b;
}