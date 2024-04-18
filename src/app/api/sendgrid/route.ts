import mail from "@sendgrid/mail"
import { NextResponse } from "next/server"

mail.setApiKey(process.env.SENDGRID_API_KEY ?? "")

type ResponseData = {
  status?: string
  message?: string
}

export async function POST(request: Request) {
  let response: ResponseData = {}
  const body = await request.json()
  const data = {
    to: body.email,
    from: "Luttaka <noreply@luttaka.com>",
    subject: body.subject,
    text: body.message,
    html: body.message.replace(/\r\n/g, "<br />"),
  }

  await mail
    .send(data)
    .then(() => {
      response = {
        status: "success",
        message: "Your message was sent.",
      }
    })
    .catch((error) => {
      response = {
        status: "error",
        message: `Message failed to send with error, ${error}`,
      }
    })

  return NextResponse.json(response)
}
