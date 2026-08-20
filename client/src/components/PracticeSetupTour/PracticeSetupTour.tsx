import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Progress, Tag } from 'antd';
import { BankOutlined, CheckCircleOutlined, RightOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './PracticeSetupTour.scss';

interface Props { patients: number; hospitals: number; doctors: number; }
interface Step { key: string; title: string; description: string; route: string; icon: React.ReactNode; }
const DISMISS_KEY = 'medaxis:practice-setup-tour-dismissed';

export default function PracticeSetupTour({ patients, hospitals, doctors }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const steps = useMemo<Step[]>(() => {
    const result: Step[] = [];
    if (!patients) result.push({ key: 'patient', title: 'Add your first patient', description: 'Patients are the foundation of your cases and follow-ups. Add one now so the rest of MedAxis can work with real data.', route: '/patients?add=1', icon: <UserAddOutlined /> });
    if (!hospitals) result.push({ key: 'hospital', title: 'Add your hospital', description: 'Save the hospitals and operating locations you use most so creating an operation takes only a few taps.', route: '/hospitals?add=1', icon: <BankOutlined /> });
    if (!doctors) result.push({ key: 'doctor', title: 'Build your medical team', description: 'Add assistant surgeons, anesthesiologists and other doctors you work with. You can then reuse them in operation teams.', route: '/doctors?add=1', icon: <TeamOutlined /> });
    return result;
  }, [patients, hospitals, doctors]);

  useEffect(() => {
    if (steps.length && localStorage.getItem(DISMISS_KEY) !== '1') {
      const timer = window.setTimeout(() => setOpen(true), 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [steps.length]);

  if (!steps.length) return null;
  const current = steps[Math.min(index, steps.length - 1)];
  const close = () => { localStorage.setItem(DISMISS_KEY, '1'); setOpen(false); };
  const go = () => { setOpen(false); navigate(current.route); };
  const next = () => setIndex((value) => Math.min(value + 1, steps.length - 1));

  return (
    <Modal open={open} onCancel={close} footer={null} centered width={440} className="practiceSetupTour">
      <div className="practiceSetupTour__icon">{current.icon}</div>
      <Tag color="blue">Setup {index + 1} of {steps.length}</Tag>
      <h2>{current.title}</h2>
      <p>{current.description}</p>
      <Progress percent={Math.round(((index + 1) / steps.length) * 100)} showInfo={false} size="small" />
      <div className="practiceSetupTour__actions">
        <Button onClick={close}>Later</Button>
        <Button type="primary" icon={index === steps.length - 1 ? <CheckCircleOutlined /> : <RightOutlined />} onClick={go}>{index === steps.length - 1 ? 'Start setup' : 'Go there'}</Button>
        {index < steps.length - 1 && <Button type="link" onClick={next}>Next</Button>}
      </div>
    </Modal>
  );
}
