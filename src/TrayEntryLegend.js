import React from "react";

const TrayEntryLegend = () => {
  return (
    <div className="tray__entry__legend">
      <div className="legend-item">
        <span>
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.25">
              <rect width="30" height="30" fill="url(#paint0_linear_670_130)" />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_670_130"
                x1="0"
                y1="30"
                x2="30"
                y2="30"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0033CC" />
                <stop offset="1" stopColor="#B76CD9" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <label>Enacted</label>
      </div>
      <div className="legend-item">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <g opacity="0.5" clipPath="url(#clip0_670_119)">
              <path
                d="M0 0H34"
                stroke="url(#paint0_linear_670_119)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="0.01 4"
              />
              <path
                d="M0 16H34"
                stroke="url(#paint1_linear_670_119)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="0.01 4"
              />
              <path
                d="M0 8H34"
                stroke="url(#paint2_linear_670_119)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="0.01 4"
              />
              <path
                d="M0 24H34"
                stroke="url(#paint3_linear_670_119)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="0.01 4"
              />
              <path
                d="M0 4H34"
                stroke="url(#paint4_linear_670_119)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="0.01 4"
              />
              <path
                d="M0 20H34"
                stroke="url(#paint5_linear_670_119)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="0.01 4"
              />
              <path
                d="M0 12H34"
                stroke="url(#paint6_linear_670_119)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="0.01 4"
              />
              <path
                d="M0 28H34"
                stroke="url(#paint7_linear_670_119)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="0.01 4"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_670_119"
                x1="0"
                y1="1"
                x2="34"
                y2="1"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0033CC" />
                <stop offset="1" stopColor="#B76CD9" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_670_119"
                x1="0"
                y1="17"
                x2="34"
                y2="17"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0033CC" />
                <stop offset="1" stopColor="#B76CD9" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_670_119"
                x1="0"
                y1="9"
                x2="34"
                y2="9"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0033CC" />
                <stop offset="1" stopColor="#B76CD9" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_670_119"
                x1="0"
                y1="25"
                x2="34"
                y2="25"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0033CC" />
                <stop offset="1" stopColor="#B76CD9" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_670_119"
                x1="0"
                y1="5"
                x2="34"
                y2="5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0033CC" />
                <stop offset="1" stopColor="#B76CD9" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_670_119"
                x1="0"
                y1="21"
                x2="34"
                y2="21"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0033CC" />
                <stop offset="1" stopColor="#B76CD9" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_670_119"
                x1="0"
                y1="13"
                x2="34"
                y2="13"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0033CC" />
                <stop offset="1" stopColor="#B76CD9" />
              </linearGradient>
              <linearGradient
                id="paint7_linear_670_119"
                x1="0"
                y1="29"
                x2="34"
                y2="29"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0033CC" />
                <stop offset="1" stopColor="#B76CD9" />
              </linearGradient>
              <clipPath id="clip0_670_119">
                <rect width="30" height="30" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </span>
        <label>Estimated</label>
      </div>
    </div>
  );
};

export default TrayEntryLegend;
