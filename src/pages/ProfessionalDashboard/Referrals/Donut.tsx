const Donut = ({
  progress = 0.75,
  radius = 24,
  stroke = 5,
  strokeColor = "stroke-white",
}) => {
  // Simple donut SVG: 75% progress as an example
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <svg width={radius * 2} height={radius * 2}>
      <circle
        stroke="#555"
        fill="transparent"
        strokeWidth={stroke}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
      />
      <circle
        className={`${strokeColor}`}
        fill="transparent"
        strokeWidth={stroke}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        strokeDasharray={circumference + " " + circumference}
        strokeDashoffset={circumference - progress * circumference}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.35s",
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
    </svg>
  );
};

export default Donut;
