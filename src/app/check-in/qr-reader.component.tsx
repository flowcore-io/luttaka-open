import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import QrScanner from "qr-scanner"

import "./qr-reader.css"

interface QrReaderProps {
  onScanSuccess: (result: QrScanner.ScanResult) => void
  onScanFail?: (err: string | Error) => void
}

const QrReader = (props: QrReaderProps) => {
  // QR States
  const scanner = useRef<QrScanner>()
  const videoEl = useRef<HTMLVideoElement>(null)
  const qrBoxEl = useRef<HTMLDivElement>(null)
  const [qrOn, setQrOn] = useState<boolean>(true)

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, props.onScanSuccess, {
        onDecodeError: props.onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current ?? undefined,
      })

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false)
        })
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop()
      }
    }
  }, [])

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.",
      )
  }, [qrOn])

  return (
    <div className="qr-reader">
      {/* QR */}
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <Image
          src={"/images/qr-frame.svg"}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        />
      </div>
    </div>
  )
}

export default QrReader
