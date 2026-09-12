import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  const assets = ["/herovideo.mp4", "/herome.png"]
  const results = await Promise.all(assets.map(async (path) => {
    try {
      const response = await fetch(`${origin}${path}`, { method: "HEAD", cache: "no-store" })
      return {
        path,
        status: response.status,
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
        acceptRanges: response.headers.get("accept-ranges"),
      }
    } catch (error) {
      return { path, error: error instanceof Error ? error.message : String(error) }
    }
  }))
  return NextResponse.json({ assets: results })
}
