import { useEffect } from 'react';
import { Avatar, Card, Form, Input, Button, Tag, Space, Spin, message, Empty, Upload } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, IdcardOutlined, CameraOutlined, DownloadOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth.service';
import { specialtyService } from '@/services/specialty.service';
import { useAuth } from '@/hooks/useAuth';
import { parseApiValidationErrors, applyValidationErrorsToAntdForm } from '@/utils/apiValidationErrors';
import { getSpecialtyLabel, getInitials } from '@/utils/helpers';
import SpecialtyFields from '@/components/SpecialtyFields/SpecialtyFields';
import type { Specialty, UpdateProfilePayload } from '@/types';
import './Profile.scss';

interface ProfileFormValues { name: string; phone?: string; specialtyIds: string[]; subspecialtyIds?: string[]; }

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const [form] = Form.useForm<ProfileFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: meData, isLoading: meLoading } = useQuery({ queryKey: ['auth-me'], queryFn: () => authService.getMe() });
  const { data: specialtiesData, isLoading: specialtiesLoading } = useQuery({ queryKey: ['specialties-list'], queryFn: () => specialtyService.getAll({ limit: 100 }), staleTime: 5 * 60 * 1000 });
  const user = meData?.data?.data;
  const specialties: Specialty[] = Array.isArray(specialtiesData?.data?.data) ? specialtiesData.data.data : [];

  useEffect(() => {
    if (!user) return;
    setUser(user);
    form.setFieldsValue({ name: user.name, phone: user.phone || undefined, specialtyIds: (user.specialties ?? []).map((specialty) => specialty.id), subspecialtyIds: (user.subspecialties ?? []).map((specialty) => specialty.id) });
  }, [user, form, setUser]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authService.updateMe(payload),
    onSuccess: (response) => {
      const updated = response.data.data;
      setUser(updated);
      queryClient.setQueryData(['auth-me'], response);
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
      queryClient.invalidateQueries({ queryKey: ['specialties-mine'] });
      queryClient.invalidateQueries({ queryKey: ['operation-catalog'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors-active'] });
      messageApi.success(t('profile.profileUpdated'));
    },
    onError: (error) => {
      const issues = parseApiValidationErrors(error);
      const applied = applyValidationErrorsToAntdForm(form, issues, t, { labelKeys: { name: 'auth.fullName', phone: 'common.phone', specialtyIds: 'profile.professionalSpecialties', subspecialtyIds: 'profile.areasOfExpertise' } });
      messageApi.error(applied ? t('validation.fixHighlightedFields') : t('common.operationFailed'));
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => authService.uploadAvatar(file),
    onSuccess: (response) => {
      const updated = response.data.data;
      setUser(updated);
      queryClient.setQueryData(['auth-me'], response);
      messageApi.success(i18n.language.startsWith('ar') ? 'تم تحديث صورة البروفايل' : 'Profile photo updated');
    },
    onError: () => messageApi.error(i18n.language.startsWith('ar') ? 'تعذر رفع الصورة' : 'Unable to upload profile photo'),
  });

  const onFinish = (values: ProfileFormValues) => updateMutation.mutate({ name: values.name.trim(), phone: values.phone?.trim() || null, specialtyIds: values.specialtyIds, subspecialtyIds: values.subspecialtyIds ?? [] });
  const printProfile = () => window.print();

  if (meLoading && !user) return <div className="profile-page page"><div className="loadingContainer"><Spin size="large" /></div></div>;
  if (!user) return <div className="profile-page page"><Empty description={t('common.operationFailed')} /></div>;

  const currentSpecialties = user.specialties ?? [];
  const currentAreas = user.subspecialties ?? [];
  const isArabic = i18n.language.startsWith('ar');

  return (
    <div className="profile-page page">
      {contextHolder}
      <div className="pageHeader profilePageHeader">
        <div className="pageHeaderLeft"><div className="pageHeaderText"><h1 className="pageTitle">{t('profile.title')}</h1></div></div>
        <Button icon={<DownloadOutlined />} onClick={printProfile}>{isArabic ? 'حفظ البطاقة PDF' : 'Save Card as PDF'}</Button>
      </div>

      <Card className="doctorProfileCard" id="doctor-profile-card">
        <div className="doctorProfileCard__top">
          <Upload accept="image/jpeg,image/png,image/webp" showUploadList={false} beforeUpload={(file) => { avatarMutation.mutate(file); return false; }} disabled={avatarMutation.isPending}>
            <button type="button" className="doctorProfileCard__avatarButton" aria-label={isArabic ? 'تغيير صورة الطبيب' : 'Change doctor photo'}>
              <Avatar size={96} src={user.avatarUrl || undefined} icon={!user.avatarUrl ? <UserOutlined /> : undefined} />
              <span><CameraOutlined /> {avatarMutation.isPending ? (isArabic ? 'جاري الرفع…' : 'Uploading…') : (isArabic ? 'تغيير الصورة' : 'Change photo')}</span>
            </button>
          </Upload>
          <div className="doctorProfileCard__identity">
            <span className="doctorProfileCard__eyebrow">{isArabic ? 'بطاقة الطبيب' : 'Doctor Profile Card'}</span>
            <h2>{user.name}</h2>
            <p>{currentSpecialties.map((specialty) => getSpecialtyLabel(specialty, i18n.language)).join(' · ') || (isArabic ? 'طبيب' : 'Doctor')}</p>
            <div className="doctorProfileCard__tags">{currentSpecialties.map((specialty) => <Tag key={specialty.id}>{getSpecialtyLabel(specialty, i18n.language)}</Tag>)}{currentAreas.map((area) => <Tag key={area.id} color="blue">{getSpecialtyLabel(area, i18n.language)}</Tag>)}</div>
          </div>
        </div>
        <div className="doctorProfileCard__details"><div><MailOutlined /><span>{user.email}</span></div><div><PhoneOutlined /><span>{user.phone || '—'}</span></div><div><IdcardOutlined /><span>{user.doctorId || '—'}</span></div></div>
      </Card>

      <Card className="profileCard">
        <h2 className="profileSectionTitle">{t('profile.accountInformation')}</h2>
        <div className="profileReadonly"><div className="profileReadonlyItem"><span className="profileTagLabel">{t('common.email')}</span><span className="profileReadonlyValue"><MailOutlined /> {user.email}</span></div><div className="profileReadonlyItem"><span className="profileTagLabel">{t('profile.doctorId')}</span><span className="profileReadonlyValue"><IdcardOutlined /> {user.doctorId || '—'}</span></div></div>
        <h2 className="profileSectionTitle">{t('profile.professionalInformation')}</h2>
        <div className="profileTags"><span className="profileTagLabel">{t('profile.professionalSpecialties')}</span>{currentSpecialties.length > 0 ? currentSpecialties.map((specialty) => <Tag key={specialty.id}>{getSpecialtyLabel(specialty, i18n.language)}</Tag>) : <span className="profileReadonlyValue">{t('profile.noSpecialties')}</span>}</div>
        <div className="profileTags"><span className="profileTagLabel">{t('profile.areasOfExpertise')}</span>{currentAreas.length > 0 ? currentAreas.map((specialty) => <Tag key={specialty.id} color="blue">{getSpecialtyLabel(specialty, i18n.language)}</Tag>) : <span className="profileReadonlyValue">{t('specialties.noAreasForSpecialty')}</span>}</div>
        <Form form={form} layout="vertical" className="entityForm" onFinish={onFinish} requiredMark>
          <Form.Item name="name" label={t('auth.fullName')} rules={[{ required: true, message: t('validation.required') }]}><Input prefix={<UserOutlined />} size="large" /></Form.Item>
          <Form.Item name="phone" label={t('common.phone')}><Input prefix={<PhoneOutlined />} size="large" inputMode="tel" allowClear /></Form.Item>
          <SpecialtyFields specialties={specialties} loading={specialtiesLoading} specialtyLabel={t('profile.professionalSpecialties')} specialtyPlaceholder={t('profile.selectSpecialties')} subspecialtyLabel={t('profile.areasOfExpertise')} subspecialtyPlaceholder={t('profile.selectAreas')} />
          <Form.Item className="entityFormActions"><Space><Button type="primary" htmlType="submit" loading={updateMutation.isPending}>{t('common.save')}</Button></Space></Form.Item>
        </Form>
      </Card>
    </div>
  );
}
