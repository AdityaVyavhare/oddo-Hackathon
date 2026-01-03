import PropTypes from "prop-types";

const Logo = ({ width = 180, height = 40, variant = "full" }) => {
  if (variant === "icon") {
    // Icon-only version for favicon and small spaces
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="globeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4A7DB0" />
            <stop offset="100%" stopColor="#2A9D8F" />
          </linearGradient>
        </defs>

        {/* Globe Circle */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="url(#globeGradient)"
          opacity="0.1"
        />
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="url(#globeGradient)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Latitude lines */}
        <ellipse
          cx="20"
          cy="20"
          rx="18"
          ry="6"
          stroke="url(#globeGradient)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <line
          x1="2"
          y1="20"
          x2="38"
          y2="20"
          stroke="url(#globeGradient)"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Longitude lines */}
        <ellipse
          cx="20"
          cy="20"
          rx="6"
          ry="18"
          stroke="url(#globeGradient)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Location Pin */}
        <path
          d="M26 14c0-3.314-2.686-6-6-6s-6 2.686-6 6c0 4.5 6 12 6 12s6-7.5 6-12z"
          fill="#F4A261"
          stroke="#F4A261"
          strokeWidth="1"
        />
        <circle cx="20" cy="14" r="2" fill="white" />
      </svg>
    );
  }

  // Full logo with text
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 180 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A7DB0" />
          <stop offset="100%" stopColor="#2A9D8F" />
        </linearGradient>
      </defs>

      {/* Globe Icon */}
      <g transform="translate(0, 0)">
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="url(#logoGradient)"
          opacity="0.1"
        />
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="url(#logoGradient)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Latitude lines */}
        <ellipse
          cx="20"
          cy="20"
          rx="18"
          ry="6"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <line
          x1="2"
          y1="20"
          x2="38"
          y2="20"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Longitude lines */}
        <ellipse
          cx="20"
          cy="20"
          rx="6"
          ry="18"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Location Pin */}
        <path
          d="M26 14c0-3.314-2.686-6-6-6s-6 2.686-6 6c0 4.5 6 12 6 12s6-7.5 6-12z"
          fill="#F4A261"
          stroke="#F4A261"
          strokeWidth="1"
        />
        <circle cx="20" cy="14" r="2" fill="white" />
      </g>

      {/* Text */}
      <text
        x="48"
        y="26"
        fontFamily="'Poppins', sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="url(#logoGradient)"
        letterSpacing="-0.5"
      >
        GlobeTrotter
      </text>
    </svg>
  );
};

Logo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  variant: PropTypes.oneOf(["full", "icon"]),
};

export default Logo;
