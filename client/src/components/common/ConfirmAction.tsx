import { Popconfirm, Button } from 'antd';
import type { ButtonProps } from 'antd';
import type { ReactNode } from 'react';
interface Props extends Omit<ButtonProps, 'danger'> { title: ReactNode; onConfirm: () => void; children?: ReactNode; }
export default function ConfirmAction({ title, onConfirm, children, ...buttonProps }: Props) { return <Popconfirm title={title} onConfirm={onConfirm}><Button danger {...buttonProps}>{children}</Button></Popconfirm>; }
