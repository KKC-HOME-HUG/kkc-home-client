import { ImageResponse } from "next/og";

// Default social-share image (brand card) for pages without their own.
// Latin-only text → no font fetch. Property detail overrides with its cover photo.
export const alt = "KKC Home Hug Property";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563eb",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>KKC Home Hug</div>
        <div style={{ fontSize: 30, letterSpacing: 10, opacity: 0.85, marginTop: 6 }}>PROPERTY</div>
        <div style={{ fontSize: 30, opacity: 0.9, marginTop: 32 }}>Khon Kaen Real Estate</div>
      </div>
    ),
    { ...size },
  );
}
