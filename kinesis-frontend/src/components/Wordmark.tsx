export default function Wordmark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const h = size === "lg" ? 44 : size === "md" ? 32 : 24;
  return (
    <svg
      viewBox="0 0 240 60"
      height={h}
      className={`w-auto ${className}`}
      fill="none"
      aria-label="Kinesis Atelier"
    >
      <path d="M12 42L28 14H42L26 42H12Z" fill="#D4FF00" />
      <path d="M28 42L44 14H58L42 42H28Z" fill="#FFFFFF" />
      <circle cx="56" cy="18" r="4" fill="#D4FF00" />
      <text
        x="74"
        y="32"
        fontFamily="Archivo, sans-serif"
        fontWeight="800"
        fontSize="22"
        letterSpacing="0.25em"
        fill="#FFFFFF"
      >
        KINESIS
      </text>
      <text
        x="75"
        y="45"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
        fontSize="8.5"
        letterSpacing="0.45em"
        fill="#94A3B8"
      >
        ATELIER // LAB
      </text>
    </svg>
  );
}
