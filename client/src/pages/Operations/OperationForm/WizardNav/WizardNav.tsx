import { CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { WizardStepDef } from '../wizardConstants';
import './WizardNav.scss';

export interface WizardNavProps {
  currentStep: number;
  stepTitles: string[];
  onStepChange: (step: number) => void;
  STEPS: readonly WizardStepDef[];
}

export default function WizardNav({
  currentStep,
  stepTitles,
  onStepChange,
  STEPS,
}: WizardNavProps) {
  const { t } = useTranslation();
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <nav className="wizardNav" aria-label={t('operations.title')}>
      <div className="wizardNavTrack" aria-hidden>
        <div className="wizardNavTrackFill" style={{ width: `${progress}%` }} />
      </div>

      <ol className="wizardNavList">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;
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
                onClick={() => onStepChange(idx)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={stepTitles[idx]}
              >
                <span className="wizardNavIcon" aria-hidden>
                  {isDone ? <CheckOutlined /> : <Icon />}
                </span>
                <span className="wizardNavLabel">{stepTitles[idx]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
