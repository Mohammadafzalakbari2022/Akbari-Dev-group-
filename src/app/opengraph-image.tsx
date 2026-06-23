import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Akbari Dev Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #070B14 0%, #0F1629 50%, #0a1a2e 100%)",
          color: "#F1F5F9",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#00E5BE",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          Akbari Dev Group
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
          All our products in one place
        </div>
        <div style={{ fontSize: 28, color: "#94A3B8", marginTop: 24 }}>
          Simple · Fast · Trusted
        </div>
      </div>
    ),
    { ...size },
  );
}
