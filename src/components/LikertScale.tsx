import { ChangeEvent } from 'react';
import TextWithBold from './TextWithBold';

interface LikertScaleProps {
  name: string;
  question: string;
  leftLabel?: string;
  rightLabel?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function LikertScale({
  name,
  question,
  leftLabel = 'Strongly Disagree',
  rightLabel = 'Strongly Agree',
  onChange
}: LikertScaleProps) {
  return (
    <div className="mb-8">
      <p className="text-lg font-medium text-gray-900 mb-4">
        <TextWithBold text={question} />
      </p>
      <div className="flex items-center justify-between gap-6">
        <span className="text-base text-gray-700 w-36 text-right flex-shrink-0">{leftLabel}</span>
        <div className="flex space-x-6 sm:space-x-8 md:space-x-10 justify-center">
          {[1, 2, 3, 4, 5, 6, 7].map(value => (
            <label key={value} className="flex flex-col items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition">
              <input 
                type="radio" 
                name={name}
                value={value}
                onChange={onChange}
                className="mb-2 h-5 w-5 text-blue-600 cursor-pointer"
                required
              />
              <span className="text-sm font-medium text-gray-700">{value}</span>
            </label>
          ))}
        </div>
        <span className="text-base text-gray-700 w-36 flex-shrink-0">{rightLabel}</span>
      </div>
    </div>
  );
}
