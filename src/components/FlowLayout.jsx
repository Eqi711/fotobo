import React from "react";
import { X } from "lucide-react";
import { STEP_DEFS } from "../config/photoboothOptions";
import Step1Camera from "./steps/Step1Camera";
import Step2ChooseFrame from "./steps/Step2ChooseFrame";
import Step3Snap from "./steps/Step3Snap";
import Step4Edit from "./steps/Step4Edit";
import Step5Download from "./steps/Step5Download";

const STEP_COMPONENTS = {
  1: Step1Camera,
  2: Step2ChooseFrame,
  3: Step3Snap,
  4: Step4Edit,
  5: Step5Download,
};

function StepBar({ step, fb, children }) {
  const isActive = step.id === fb.activeStep;
  const canRevisit = step.id <= fb.maxStepReached && !isActive;

  return (
    <div
      onClick={() => canRevisit && fb.goToStep(step.id)}
      className={`${
        isActive ? "flex-1" : "w-8 sm:w-12"
      } h-full transition-all duration-500 flex items-center justify-center ${
        canRevisit ? "cursor-pointer" : ""
      }`}
      style={{ backgroundColor: step.color }}
    >
      {isActive ? (
        <div className="w-full h-full p-3 sm:p-6 md:p-8">
          <div className="bg-white w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-y-auto p-6 sm:p-8">
            {children}
          </div>
        </div>
      ) : (
        <span
          className="text-xs font-semibold whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: step.textOn,
          }}
        >
          {step.label}
        </span>
      )}
    </div>
  );
}

export default function FlowLayout({ fb }) {
  return (
    <div className="h-screen w-full flex relative">
      <button
        onClick={fb.exitToLanding}
        aria-label="Exit to home"
        className="fixed top-3 right-3 z-50 bg-white rounded-full p-2 shadow-lg"
      >
        <X size={18} />
      </button>
      {STEP_DEFS.map((step) => {
        const StepComponent = STEP_COMPONENTS[step.id];
        return (
          <StepBar key={step.id} step={step} fb={fb}>
            {step.id === fb.activeStep && <StepComponent fb={fb} />}
          </StepBar>
        );
      })}
    </div>
  );
}