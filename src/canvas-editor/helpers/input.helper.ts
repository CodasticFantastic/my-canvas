/**
 * Helper function to format and validate name input on blur.
 * Trims whitespace from start and end, and prevents empty names.
 *
 * If input is empty or has only spaces, return old name
 */
export function handleNameInputFormat(name: string, oldName: string): string {
  const trimmedName = name.trim();

  return trimmedName.length > 0 ? trimmedName : oldName;
}
