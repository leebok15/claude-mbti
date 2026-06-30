import { cn } from '@/lib/cn'
import type { Question } from '@/types'

interface Props {
  question: Question
  selected: 'A' | 'B' | undefined
  onSelect: (value: 'A' | 'B') => void
}

export default function QuestionCard({ question, selected, onSelect }: Props) {
  return (
    <div className="animate-slide-in">
      <p className="text-xl font-semibold text-gray-800 leading-relaxed mb-8 text-center px-2">
        {question.text}
      </p>

      <div className="flex flex-col gap-4">
        {(['A', 'B'] as const).map((key) => {
          const option = key === 'A' ? question.optionA : question.optionB
          const isSelected = selected === key

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={cn(
                'w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 group',
                isSelected
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-sm'
              )}
            >
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                    isSelected
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'
                  )}
                >
                  {key}
                </span>
                <span className={cn(
                  'text-base font-medium leading-snug transition-colors',
                  isSelected ? 'text-purple-800' : 'text-gray-700'
                )}>
                  {option.text}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
