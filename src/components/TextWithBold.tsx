import React from 'react';

interface TextWithBoldProps {
  text: string;
  className?: string;
  as?: 'span' | 'p' | 'div';
}

/**
 * Renders text with **bold** markers converted to <strong> tags
 * Usage: <TextWithBold text="This is **bold** text" />
 * Supports newlines and whitespace-pre-line styling
 */
export default function TextWithBold({ text, className = '', as = 'span' }: TextWithBoldProps) {
  // Split by **text** pattern and render with bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  const content = parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove ** and render as bold
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold">{boldText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });

  const Tag = as;
  return <Tag className={className}>{content}</Tag>;
}
