/**
 * Generate initials from a name string
 */
export const generateInitials = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return '?';
  }

  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '?';

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Format contact name for display
 */
export const formatContactName = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return 'Unknown';
  }

  return name.trim();
};


