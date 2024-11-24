import { FC } from "react";
import "../styles/ProgressBar.scss";

type ProgressBarProps = {
  currentPage: number;
};

const ProgressBar: FC<ProgressBarProps> = ({ currentPage }) => {
  const steps = [
    { label: "Mandatory Information", number: 1 },
    { label: "Add Links", number: 2 },
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
          {index < steps.length - 1 && <div className="line"></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
