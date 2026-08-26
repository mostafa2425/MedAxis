import type { CSSProperties } from "react";
import "./BrandLogo.scss";

interface BrandLogoProps {
  compact?: boolean;
  dark?: boolean;
  width?: number;
  className?: string;
  alt?: string;
}

export default function BrandLogo({
  compact = false,
  dark = false,
  width,
  className = "",
  alt = "MedAxis",
}: BrandLogoProps) {
  const src = compact
    ? dark
      ? "/brand/medaxis-mark-dark.svg"
      : "/brand/medaxis-mark.svg"
    : dark
      ? "/brand/medaxis-logo-dark.svg"
      : "/brand/medaxis-logo.svg";

  const style: CSSProperties = compact
    ? { width: width ?? 38, height: width ?? 38 }
    : { width: width ?? 190, height: "auto", maxWidth: "100%" };

  return <img className={`brandLogo ${className}`.trim()} src={src} alt={alt} style={style} />;
}
