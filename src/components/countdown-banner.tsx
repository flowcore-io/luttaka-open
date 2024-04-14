import React, { useEffect, useState } from "react"

interface CountdownBannerProps {
  targetDate: Date
}

const CountdownBanner: React.FC<CountdownBannerProps> = ({ targetDate }) => {
  const [countdown, setCountdown] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      // Update the countdown state
      setCountdown(distance > 0 ? distance : 0)

      // Clear the interval when the countdown reaches zero
      if (distance <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [targetDate])

  const days = Math.floor(countdown / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000)

  return (
    <div className="flex h-16 w-full flex-row justify-center gap-x-4 bg-navigation p-2 text-white">
      {countdown > 0 ? (
        <>
          <div className="flex w-16 flex-col items-center">
            <div>{days}</div>
            <div className="text-xs">days</div>
          </div>
          <div className="flex w-16 flex-col items-center">
            <div>{hours}</div>
            <div className="text-xs">hours</div>
          </div>
          <div className="flex w-16 flex-col items-center">
            <div>{minutes}</div>
            <div className="text-xs">minutes</div>
          </div>
          <div className="flex w-16 flex-col items-center">
            <div>{seconds}</div>
            <div className="text-xs">seconds</div>
          </div>
        </>
      ) : (
        <>
          <div className="flex w-16 flex-col items-center">
            <div>&nbsp;</div>
            <div className="text-xs">days</div>
          </div>
          <div className="flex w-16 flex-col items-center">
            <div>&nbsp;</div>
            <div className="text-xs">hours</div>
          </div>
          <div className="flex w-16 flex-col items-center">
            <div>&nbsp;</div>
            <div className="text-xs">minutes</div>
          </div>
          <div className="flex w-16 flex-col items-center">
            <div>&nbsp;</div>
            <div className="text-xs">seconds</div>
          </div>
        </>
      )}
    </div>
  )
}

export default CountdownBanner
