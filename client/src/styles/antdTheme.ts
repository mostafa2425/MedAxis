import type { ThemeConfig } from 'antd';

export const medAxisAntdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 10,
    controlHeight: 40,
    controlHeightLG: 44,
    fontSize: 14,
    colorBgLayout: '#f6f8fb',
  },
  components: {
    Card: { borderRadiusLG: 14 },
    Button: { borderRadius: 9, controlHeight: 40 },
    Input: { borderRadius: 9 },
    Select: { borderRadius: 9 },
    InputNumber: { borderRadius: 9 },
    Modal: { borderRadiusLG: 16 },
    Tabs: { horizontalItemGutter: 28 },
  },
};
