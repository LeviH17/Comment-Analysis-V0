import type { VolumePoint } from "@/lib/types";

export function VolumeSparkline({
  points,
  width = 100,
  height = 28,
  color = "#0f172a",
}: {
  points: VolumePoint[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (points.length === 0) {
    return <svg width={width} height={height} aria-hidden />;
  }
  if (points.length === 1) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
        <circle cx={width / 2} cy={height / 2} r={2} fill={color} />
      </svg>
    );
  }
  const max = Math.max(...points.map((p) => p.count), 1);
  const stepX = width / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = height - (p.count / max) * (height - 4) - 2;
    return [x, y] as const;
  });

  const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath =
    `M0,${height} ` +
    coords.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(" ") +
    ` L${width},${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path d={areaPath} fill={color} fillOpacity={0.08} />
      <path d={linePath} stroke={color} strokeWidth={1.5} fill="none" strokeLinejoin="round" />
    </svg>
  );
}
