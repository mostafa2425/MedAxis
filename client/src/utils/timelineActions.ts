export const TIMELINE_ACTION_LABELS: Record<string, { en: string; ar: string }> = {
  OPERATION_CREATED: { en: 'Operation created', ar: 'تم إنشاء العملية' },
  OPERATION_UPDATED: { en: 'Operation updated', ar: 'تم تحديث بيانات العملية' },
  OPERATION_STATUS_CHANGED: { en: 'Operation status changed', ar: 'تم تغيير حالة العملية' },
  OPERATION_COMPLETED: { en: 'Operation completed', ar: 'تم إكمال العملية' },
  OPERATION_CANCELLED: { en: 'Operation cancelled', ar: 'تم إلغاء العملية' },
  COST_UPDATED: { en: 'Cost updated', ar: 'تم تحديث التكلفة' },
  FILE_UPLOADED: { en: 'Clinical file uploaded', ar: 'تم رفع ملف طبي' },
  FILE_DELETED: { en: 'Clinical file removed', ar: 'تم حذف ملف طبي' },
  OPERATION_FILE_UPLOADED: { en: 'Clinical file uploaded', ar: 'تم رفع ملف طبي' },
  OPERATION_FILE_DELETED: { en: 'Clinical file removed', ar: 'تم حذف ملف طبي' },
  MEDICAL_TEAM_UPDATED: { en: 'Medical team updated', ar: 'تم تحديث الفريق الطبي' },
  PATIENT_UPDATED: { en: 'Patient information updated', ar: 'تم تحديث بيانات المريض' },
  PROCEDURE_ADDED: { en: 'Procedure added', ar: 'تمت إضافة إجراء' },
  PROCEDURE_UPDATED: { en: 'Procedure updated', ar: 'تم تحديث الإجراء' },
  PROCEDURE_REMOVED: { en: 'Procedure removed', ar: 'تم حذف الإجراء' },
};

export function getTimelineActionLabel(action: string | null | undefined, language: string) {
  if (!action) return language.startsWith('ar') ? 'تحديث في الحالة' : 'Case activity';

  const normalized = action.trim().toUpperCase();
  const known = TIMELINE_ACTION_LABELS[normalized];
  if (known) return language.startsWith('ar') ? known.ar : known.en;

  return normalized
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}
