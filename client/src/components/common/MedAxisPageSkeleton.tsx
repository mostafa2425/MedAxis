import { Card, Skeleton } from 'antd';

interface MedAxisPageSkeletonProps {
  rows?: number;
  cards?: number;
}

export default function MedAxisPageSkeleton({ rows = 5, cards = 2 }: MedAxisPageSkeletonProps) {
  return (
    <div className="medaxis-content-skeleton" role="status" aria-label="Loading content" aria-live="polite">
      <div className="medaxis-skeleton-header">
        <div>
          <Skeleton.Input active size="small" style={{ width: 110 }} />
          <Skeleton.Input active size="large" style={{ width: 240, maxWidth: '70vw', marginTop: 10 }} />
        </div>
        <Skeleton.Button active size="large" style={{ width: 132 }} />
      </div>
      <div className="medaxis-skeleton-grid">
        {Array.from({ length: cards }).map((_, index) => (
          <Card key={`card-${index}`} bordered={false} className="medaxis-skeleton-card">
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        ))}
      </div>
      <Card bordered={false} className="medaxis-skeleton-list">
        <Skeleton active paragraph={{ rows }} />
      </Card>
    </div>
  );
}
