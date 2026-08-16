import { operationService } from '@/services/operation.service';
import type { Operation, OperationFilters } from '@/types';

const PAGE_LIMIT = 100;

export async function fetchCalendarOperations(params: OperationFilters): Promise<Operation[]> {
  const first = await operationService.getAll({
    ...params,
    page: 1,
    limit: PAGE_LIMIT,
    sortBy: 'operationDate',
    sortOrder: 'asc',
  });

  const items = first.data?.data ?? [];
  const total = first.data?.pagination?.total ?? first.data?.meta?.total ?? items.length;
  if (items.length >= total) return items;

  const pageCount = Math.ceil(total / PAGE_LIMIT);
  const rest = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      operationService.getAll({
        ...params,
        page: index + 2,
        limit: PAGE_LIMIT,
        sortBy: 'operationDate',
        sortOrder: 'asc',
      }),
    ),
  );

  return items.concat(...rest.map((response) => response.data?.data ?? []));
}
