import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room") || `translator-room-${Math.floor(Math.random() * 10000)}`;
  const identity = req.nextUrl.searchParams.get("identity") || `user-${Math.floor(Math.random() * 10000)}`;

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured: LIVEKIT_API_KEY, LIVEKIT_API_SECRET, or LIVEKIT_URL is missing." },
      { status: 500 }
    );
  }

  const at = new AccessToken(apiKey, apiSecret, { identity });
  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return NextResponse.json({
    token: await at.toJwt(),
    wsUrl,
    room,
    identity,
  });
}
