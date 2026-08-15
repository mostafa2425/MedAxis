import { Button } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SaveOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './WizardActions.scss';

export interface WizardActionsProps {
  currentStep: number;
  isSaving: boolean;
  savedOperationId: string | null;
  isEditMode?: boolean;
  canContinue?: boolean;
  onBack: () => void;
  onNext: () => void;
  onQuickSave: () => void;
  onSubmit: () => void;
}

export default function WizardActions({
  currentStep,
  isSaving,
  savedOperationId,
  isEditMode = false,
  canContinue = true,
  onBack,
  onNext,
  onQuickSave,
  onSubmit,
}: WizardActionsProps) {
  const { t } = useTranslation();
  const isPatientStep = currentStep === 0;

  return (
    <div className={`wizardActions${isPatientStep ? ' wizardActions--patient' : ''}`}>
      <div className="wizardActionsInner">
        {!isPatientStep && (
          <div className="wizardActionsStart">
            {currentStep > 0 && (
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={onBack}
                className="backBtn"
              >
                {t('common.back')}
              </Button>
            )}
          </div>
        )}

        <div className={`wizardActionsEnd${isPatientStep ? ' wizardActionsEnd--full' : ''}`}>
          {currentStep >= 1 && currentStep < 5 && !savedOperationId && (
            <Button
              size="large"
              icon={<SaveOutlined />}
              onClick={onQuickSave}
              loading={isSaving}
              className="quickSaveBtn"
            >
              {t('operations.quickSave')}
            </Button>
          )}

          {currentStep < 5 && (
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={onNext}
              disabled={!canContinue}
              className={`nextBtn${isPatientStep ? ' nextBtn--full' : ''}`}
            >
              {isPatientStep ? t('operations.continueToDetails') : t('common.next')}
            </Button>
          )}

          {currentStep === 5 && (
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={onSubmit}
              loading={isSaving}
              className="submitBtn"
            >
              {isEditMode
                ? t('common.save')
                : savedOperationId
                  ? t('operations.saveAndContinue')
                  : t('common.submit')}
            </Button>
          )}
        </div>
      </div>

      {isPatientStep && !canContinue && (
        <p className="wizardActionsHint">{t('operations.selectOrCreatePatient')}</p>
      )}
    </div>
  );
}
