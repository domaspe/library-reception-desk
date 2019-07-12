export function itemToString(item) {
  if (!item) {
    return '';
  }

  return `(${item.id}) ${item.name}`;
}
