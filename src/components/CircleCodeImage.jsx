import React, { useRef } from "react";
import html2canvas from "html2canvas";

const CircleCodeImage = ({
  text = "this is code",
  label = "ကံစမ်းမဲပါသည်",
}) => {
  const ref = useRef(null);

  const downloadImage = async () => {
    const canvas = await html2canvas(ref.current);
    const link = document.createElement("a");
    link.download = "circle-code.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="p-4 text-center">
      <div ref={ref} style={{ width: 300, height: 300 }}>
        <svg width="300" height="300">
          {/* Outer circle */}
          <circle
            cx="150"
            cy="150"
            r="90"
            stroke="#FF66CC"
            strokeWidth="4"
            fill="none"
          />
          {/* Inner circle */}
          <circle
            cx="150"
            cy="150"
            r="50"
            stroke="#888"
            strokeWidth="1"
            fill="none"
          />

          {/* Curved Text on Path (closer to inner circle) */}
          <defs>
            <path
              id="textPath"
              d="
                M 85,150
                A 65,65 0 1,1 215,150
                A 65,65 0 1,1 85,150
              "
              fill="none"
            />
          </defs>
          <text fill="#000" fontSize="14" fontWeight="bold">
            <textPath href="#textPath" startOffset="50%" textAnchor="middle">
              {text}
            </textPath>
          </text>

          {/* Center label */}
          <text
            x="150"
            y="145"
            fontSize="16"
            textAnchor="middle"
            fontWeight="bold"
          >
            ကံစမ်းမဲ
          </text>
          <text
            x="150"
            y="170"
            fontSize="16"
            textAnchor="middle"
            fontWeight="bold"
          >
            ပါသည်
          </text>
        </svg>
      </div>
      <button
        onClick={downloadImage}
        className="mt-4 px-4 py-2 bg-pink-500 text-white rounded"
      >
        Download PNG
      </button>
    </div>
  );
};

export default CircleCodeImage;
