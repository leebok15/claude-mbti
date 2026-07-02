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
      <p className="text-2xl font-bold text-black leading-snug mb-10 tracking-tight">
        {question.text}
      </p>

      <div className="flex flex-col gap-3">
        {(['A', 'B'] as const).map((key) => {
          const option = key === 'A' ? question.optionA : question.optionB
          const isSelected = selected === key

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={cn(
                'w-full p-5 border text-left transition-all duration-200 group',
                isSelected
                  ? 'border-black bg-black'
                  : 'border-black/15 bg-white hover:border-black/50'
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    'flex-shrink-0 w-7 h-7 flex items-center justify-center text-xs font-black border transition-colors',
                    isSelected
                      ? 'border-transparent text-black'
                      : 'border-black/20 text-black/40 group-hover:border-black/50 group-hover:text-black'
                  )}
                  style={isSelected ? { backgroundColor: '#F5E642' } : {}}
                >
                  {key}
                </span>
                <span className={cn(
                  'text-base font-medium leading-snug pt-0.5 transition-colors',
                  isSelected ? 'text-white' : 'text-black/70 group-hover:text-black'
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
