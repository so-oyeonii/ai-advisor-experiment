import { ChangeEvent } from 'react';

interface SemanticDifferentialProps {
  name: string;
  leftLabel: string;
  rightLabel: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SemanticDifferential({ 
  name, 
  leftLabel, 
  rightLabel, 
  onChange 
}: SemanticDifferentialProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-gray-700 w-32 text-right flex-shrink-0">{leftLabel}</span>
        <div className="flex space-x-2 justify-center">
          {[1, 2, 3, 4, 5, 6, 7].map(value => (
            <label key={value} className="flex flex-col items-center cursor-pointer">
              <input 
                type="radio" 
                name={name}
                value={value}
                onChange={onChange}
                className="mb-1 h-4 w-4 text-blue-600"
                required
              />
              <span className="text-xs text-gray-600">{value}</span>
            </label>
          ))}
        </div>
        <span className="text-sm text-gray-700 w-32 flex-shrink-0">{rightLabel}</span>
      </div>
    </div>
  );
}
