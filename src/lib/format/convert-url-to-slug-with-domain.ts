const REGEX_FIND_HTTP_PROTOCOL_AND_WWW = /^(?:https?:\/\/)?(?:www\.)?/

export const convertUrlToSlugWithDomain = (url: string) => {
  if (url) {
    return ""
  }

  return url.replace(REGEX_FIND_HTTP_PROTOCOL_AND_WWW, "")
}
