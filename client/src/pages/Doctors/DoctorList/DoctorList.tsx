import { Button, Empty, Spin, Pagination, Skeleton } from 'antd';
import {
  PlusOutlined,
  UserAddOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
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

  const showSkeletons = isLoading && doctors.length === 0;

  const emptyNode = (
    <div className="doctorListEmpty">
      <div className="doctorListEmptyIcon">
        <UserAddOutlined />
      </div>

      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="doctorListEmptyContent">
            <span className="doctorListEmptyTitle">
              {hasSearch
                ? t('common.noResults')
                : t('doctors.noDoctors')}
            </span>

            <span className="doctorListEmptyDescription">
              {hasSearch
                ? t(
                    'common.tryDifferentSearch',
                    'Try adjusting your search or filters.',
                  )
                : t(
                    'doctors.noDoctorsDescription',
                    'Add your first doctor to start managing your medical team.',
                  )}
            </span>
          </div>
        }
      >
        {hasSearch ? (
          <Button
            icon={<ReloadOutlined />}
            onClick={() => onPageChange(1)}
          >
            {t('common.reset', 'Reset')}
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            {t('doctors.addDoctor')}
          </Button>
        )}
      </Empty>
    </div>
  );

  const skeletons = Array.from({ length: 6 }).map((_, index) => (
    <div
      key={`doctor-skeleton-${index}`}
      className="doctorListSkeleton"
    >
      <div className="doctorListSkeletonHeader">
        <Skeleton.Avatar
          active
          size={56}
          shape="circle"
        />

        <div className="doctorListSkeletonInfo">
          <Skeleton.Input
            active
            size="small"
            style={{ width: '65%' }}
          />

          <Skeleton.Input
            active
            size="small"
            style={{ width: '45%' }}
          />
        </div>
      </div>

      <div className="doctorListSkeletonBody">
        <Skeleton.Input
          active
          size="small"
          block
        />

        <Skeleton.Input
          active
          size="small"
          style={{ width: '80%' }}
        />

        <Skeleton.Input
          active
          size="small"
          style={{ width: '55%' }}
        />
      </div>

      <div className="doctorListSkeletonFooter">
        <Skeleton.Button
          active
          size="small"
          style={{ width: 72 }}
        />

        <Skeleton.Button
          active
          size="small"
          style={{ width: 72 }}
        />
      </div>
    </div>
  ));

  return (
    <div className="doctorList">
      <Spin
        spinning={isLoading && doctors.length > 0}
        wrapperClassName="doctorListSpin"
      >
        {doctors.length === 0 && !isLoading ? (
          emptyNode
        ) : (
          <div className="doctorListGrid">
            {showSkeletons
              ? skeletons
              : doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="doctorListItem"
                  >
                    <DoctorCard
                      doctor={doctor}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
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
            responsive
          />
        </div>
      )}
    </div>
  );
}