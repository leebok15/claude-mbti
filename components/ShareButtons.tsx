'use client'

import { useState, useRef } from 'react'
import type { MBTIType } from '@/types'

interface Props {
  type: MBTIType
  shareCardRef: React.RefObject<HTMLDivElement>
}

export default function ShareButtons({ type, shareCardRef }: Props) {
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/result?type=${type.code}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveImage = async () => {
    if (!shareCardRef.current || saving) return
    setSaving(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      })
      const link = document.createElement('a')
      link.download = `mbti-${type.code}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      alert('이미지 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleSaveImage}
        disabled={saving}
        className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all"
        style={{ backgroundColor: type.color }}
      >
        {saving ? '저장 중...' : '이미지로 저장하기'}
      </button>

      <button
        onClick={handleCopyLink}
        className="w-full py-3.5 rounded-2xl font-semibold border-2 transition-all"
        style={{
          borderColor: type.color,
          color: copied ? '#fff' : type.color,
          backgroundColor: copied ? type.color : 'transparent',
        }}
      >
        {copied ? '링크 복사 완료!' : '링크 복사하기'}
      </button>
    </div>
  )
}
