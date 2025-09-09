import React from 'react';

export function formatQuestionText(text: string): React.ReactNode {
  // Convert markdown-style italics (*text*) to React elements
  const parts = text.split(/(\*[^*]+\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      // Remove asterisks and render as italic
      const italicText = part.slice(1, -1);
      return <em key={index} className="font-semibold text-vermilion-400">{italicText}</em>;
    }
    return part;
  });
}
