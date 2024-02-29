import Image from "next/image"
import QrScanner from "qr-scanner"
import { useEffect, useRef, useState } from "react"

interface QrReaderProps {
  onScanSuccess: (result: string) => void
}

const QrReader = (props: QrReaderProps) => {
  // QR States
  const scanner = useRef<QrScanner>()
  const videoEl = useRef<HTMLVideoElement>(null)
  const qrBoxEl = useRef<HTMLDivElement>(null)
  const [qrOn, setQrOn] = useState<boolean>(true)

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    scanner.current?.stop()
    props.onScanSuccess(result.data)
  }

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current ?? undefined,
      })

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false)
        })
    }

    return () => {
      if (!videoEl?.current) {
        scanner.current?.stop()
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
    <div
      className={
        "relative mx-auto h-50vh w-full overflow-hidden rounded-md border border-gray-800 shadow-lg"
      }>
      <video ref={videoEl} className={"h-full w-full object-cover"}></video>
      <div ref={qrBoxEl} className={"left-0 w-full"}>
        <Image
          src={"/images/qr-frame.svg"}
          alt="Qr Frame"
          width={256}
          height={256}
          className={
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform fill-none"
          }
        />
      </div>
    </div>
  )
}

export default QrReader
