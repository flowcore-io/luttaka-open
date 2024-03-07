export default function doMailto(email: string, subject: string, body: string) {
  // Encode parameters in standard URI format to ensure they will be correctly interpreted by email clients
  subject = encodeURIComponent(subject)
  body = encodeURIComponent(body)

  // Construct the 'mailto' URL
  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`

  // Create a new window with the 'mailto' URL
  const win = window.open(mailtoLink, "_blank")

  // Ensure the new window was successfully opened
  if (win) {
    win.focus()
  } else {
    throw new Error("Could not open new window for sending email")
  }
}
