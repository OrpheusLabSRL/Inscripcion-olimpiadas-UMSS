import "./ProgressBar.css";

export default function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="progress-container">
      {[...Array(totalSteps)].map((_, index) => {
        const stepNumber = index + 1;
        return (
          <div key={index} className="step-wrapper">
            {/* Línea de progreso */}
            {index > 0 && (
              <div
                className={`line ${stepNumber <= currentStep ? "active" : ""}`}
              />
            )}
            {/* Número del paso */}
            <div
              className={`step ${stepNumber <= currentStep ? "active" : ""}`}
            >
              {stepNumber}
            </div>
          </div>
        );
      })}
    </div>
  );
}
