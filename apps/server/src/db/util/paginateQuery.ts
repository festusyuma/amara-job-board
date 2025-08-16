/* eslint-disable @typescript-eslint/no-explicit-any */

import { SelectQueryBuilder } from 'kysely';

export function paginateQuery<
  T extends { page?: number; size?: number },
  QB extends SelectQueryBuilder<any, any, any>
>(query: T, qb: QB) {
  const page = query.page ?? 0;
  const size = query.size ?? 10;

  return qb.limit(size ?? 10).offset(page * size);
}
