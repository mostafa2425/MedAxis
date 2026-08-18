import { InputNumber, Space, Typography } from 'antd';
import type { InputNumberProps } from 'antd';
import './DesignSystem.scss';

interface Props extends Omit<InputNumberProps<number>, 'formatter' | 'parser'> { currency?: string; }
export default function MoneyInput({ currency = 'EGP', ...props }: Props) { return <Space.Compact block className="ds-money-input"><InputNumber<number> min={0} precision={2} controls={false} inputMode="decimal" {...props} formatter={(value) => value == null ? '' : String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value?.replace(/,/g, '') ?? ''} /><Typography.Text className="ds-money-input__currency">{currency}</Typography.Text></Space.Compact>; }
