import { FC } from "react";
import "../styles/ProgressBar.scss";

type ProgressBarProps = {
  currentPage: number;
};

const ProgressBar: FC<ProgressBarProps> = ({ currentPage }) => {
  const steps = [
    { label: "Mandatory Information", number: 1 },
    { label: "Add Connections", number: 2 },
    { label: "Add Original Resources", number: 3 },
  ];
  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${currentPage >= step.number ? "active" : ""} ${
            currentPage > step.number ? "completed" : ""
          }`}
        >
          <div className="circle">{step.number}</div>
          <span className="label">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
