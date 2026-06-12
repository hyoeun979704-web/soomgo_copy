import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { api } from '../api/client'
import type { QuoteRequest, Service } from '../types'

const STEPS = ['지역', '일정', '상세 내용'] as const

export default function RequestWizard() {
  const { serviceId } = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [step, setStep] = useState(0)
  const [region, setRegion] = useState('')
  const [schedule, setSchedule] = useState('')
  const [detail, setDetail] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get<Service>(`/services/${serviceId}`).then(setService).catch((e) => setError(e.message))
  }, [serviceId])

  const canNext = step === 0 ? region.trim() !== '' : step === 1 ? schedule.trim() !== '' : true

  async function submit() {
    try {
      const req = await api.post<QuoteRequest>('/requests', {
        service_id: Number(serviceId),
        region,
        schedule,
        detail,
      })
      navigate(`/received/${req.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '요청에 실패했습니다.')
    }
  }

  if (error) return <div className="page-status">{error}</div>
  if (!service) return <div className="page-status">불러오는 중...</div>

  return (
    <div className="page wizard">
      <header className="page-header">
        <button className="icon-button" onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))}>
          ←
        </button>
        <span className="page-title">{service.name} 견적 요청</span>
      </header>

      <div className="wizard-progress">
        {STEPS.map((label, i) => (
          <span key={label} className={`wizard-dot${i <= step ? ' active' : ''}`} />
        ))}
      </div>

      {step === 0 && (
        <section className="wizard-step">
          <h2>어느 지역에서 서비스가 필요하세요?</h2>
          <input
            placeholder="예) 서울 강남구"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            autoFocus
          />
        </section>
      )}
      {step === 1 && (
        <section className="wizard-step">
          <h2>언제 서비스가 필요하세요?</h2>
          <div className="chip-group">
            {['가능한 빨리', '이번 주', '이번 달', '날짜 협의'].map((option) => (
              <button
                key={option}
                className={`chip${schedule === option ? ' selected' : ''}`}
                onClick={() => setSchedule(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      )}
      {step === 2 && (
        <section className="wizard-step">
          <h2>고수에게 전달할 내용을 적어주세요</h2>
          <textarea
            placeholder="요청 내용을 자세히 적을수록 정확한 견적을 받을 수 있어요."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={6}
          />
        </section>
      )}

      <button
        className="primary-button wizard-next"
        disabled={!canNext}
        onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : submit())}
      >
        {step < STEPS.length - 1 ? '다음' : '견적 요청하기'}
      </button>
    </div>
  )
}
