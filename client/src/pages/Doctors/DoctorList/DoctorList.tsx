import { Button, Empty, Spin, Pagination, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Doctor } from '@/types';
import DoctorCard from '../DoctorCard/DoctorCard';
import './DoctorList.scss';

export interface DoctorListProps {
  doctors: Doctor[];
  isLoading?: boolean;
  hasSearch?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
}

export default function DoctorList({
  doctors,
  isLoading = false,
  hasSearch = false,
  page,
  pageSize,
  total,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
}: DoctorListProps) {
  const { t } = useTranslation();

  const emptyNode = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={hasSearch ? t('common.noResults') : t('doctors.noDoctors')}
    >
      {!hasSearch && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          {t('doctors.addDoctor')}
        </Button>
      )}
    </Empty>
  );

  const showSkeletons = isLoading && doctors.length === 0;

  return (
    <div className="doctorList">
      <Spin spinning={isLoading && doctors.length > 0}>
        {doctors.length === 0 && !isLoading ? (
          emptyNode
        ) : (
          <div className="doctorListGrid">
            {showSkeletons
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Card key={`skeleton-${index}`} className="doctorListSkeleton" loading />
                ))
              : doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
          </div>
        )}
      </Spin>

      {total > pageSize && (
        <div className="doctorListPagination">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            showSizeChanger={false}
            showLessItems
            hideOnSinglePage
          />
        </div>
      )}
    </div>
  );
}
