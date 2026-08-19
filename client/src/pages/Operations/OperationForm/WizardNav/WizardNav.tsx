import { CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { WizardStepDef } from '../wizardConstants';
import './WizardNav.scss';

export interface WizardNavProps {
  currentStep: number;
  stepTitles?: string[];
  onStepChange?: (step: number) => void;
  STEPS?: readonly WizardStepDef[];
  // Backward-compatible aliases used by the current OperationFormPage.
  steps?: readonly WizardStepDef[];
  onStepClick?: (step: number) => void;
}

export default function WizardNav({
  currentStep,
  stepTitles = [],
  onStepChange,
  STEPS,
  steps,
  onStepClick,
}: WizardNavProps) {
  const { t } = useTranslation();
  const wizardSteps = STEPS ?? steps ?? [];
  const handleStepChange = onStepChange ?? onStepClick ?? (() => undefined);
  const safeCurrentStep = Math.max(0, Math.min(currentStep, Math.max(wizardSteps.length - 1, 0)));
  const progress = wizardSteps.length > 0 ? ((safeCurrentStep + 1) / wizardSteps.length) * 100 : 0;

  return (
    <nav className="wizardNav" aria-label={t('operations.title')}>
      <div className="wizardNavTrack" aria-hidden>
        <div className="wizardNavTrackFill" style={{ width: `${progress}%` }} />
      </div>

      <ol className="wizardNavList">
        {wizardSteps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === safeCurrentStep;
          const isDone = idx < safeCurrentStep;
          const stateClass = isActive
            ? 'isActive'
            : isDone
              ? 'isDone'
              : 'isUpcoming';

          return (
            <li key={step.key} className="wizardNavItem">
              <button
                type="button"
                className={`wizardNavStep ${stateClass}`}
                onClick={() => handleStepChange(idx)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={stepTitles[idx] ?? step.key}
              >
                <span className="wizardNavIcon" aria-hidden>
                  {isDone ? <CheckOutlined /> : <Icon />}
                </span>
                <span className="wizardNavLabel">{stepTitles[idx] ?? step.key}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
