import { Card, Empty, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { getSpecialtyLabel } from '@/utils/helpers';
import type { DoctorSpecialtyRef, Specialty } from '@/types';
import './MySpecialtyGroups.scss';

export interface MySpecialtyGroupsProps {
  specialties: DoctorSpecialtyRef[];
  areas: Specialty[];
  isLoading?: boolean;
  search?: string;
}

export default function MySpecialtyGroups({
  specialties,
  areas,
  isLoading = false,
  search = '',
}: MySpecialtyGroupsProps) {
  const { t, i18n } = useTranslation();
  const term = search.trim().toLowerCase();

  if (!isLoading && specialties.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={t('specialties.noMySpecialties')}
      />
    );
  }

  const grouped = specialties.map((specialty) => {
    const children = areas.filter((area) => area.parentId === specialty.id);
    const parentLabel = getSpecialtyLabel(specialty, i18n.language).toLowerCase();
    const parentMatch = term.length > 0 && parentLabel.includes(term);
    const matchingChildren = term
      ? children.filter((area) =>
          getSpecialtyLabel(area, i18n.language).toLowerCase().includes(term),
        )
      : children;
    return {
      specialty,
      areas: parentMatch ? children : matchingChildren,
      include: term.length === 0 || parentMatch || matchingChildren.length > 0,
    };
  });

  const visible = grouped.filter((group) => group.include);

  if (!isLoading && visible.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={term ? t('common.noResults') : t('specialties.noSpecialties')}
      />
    );
  }

  return (
    <div className="mySpecialtyGroups">
      {visible.map(({ specialty, areas: groupAreas }) => (
        <Card
          key={specialty.id}
          className="mySpecialtyCard"
          title={getSpecialtyLabel(specialty, i18n.language)}
        >
          <h3 className="mySpecialtyAreasLabel">{t('specialties.areasOfExpertise')}</h3>
          {groupAreas.length === 0 ? (
            <p className="mySpecialtyEmptyAreas">{t('specialties.noAreasForSpecialty')}</p>
          ) : (
            <div className="mySpecialtyTags">
              {groupAreas.map((area) => (
                <Tag key={area.id} color="blue">
                  {getSpecialtyLabel(area, i18n.language)}
                </Tag>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
