import { BaseQueryDto } from './dto/base-query.dto';

// Only whitelisted fields can be sorted / included: Prisma throws on unknown ones
// and some relations (user) would leak data.
export function toInclude(requested: string[] = [], allowed: string[]) {
  const include = Object.fromEntries(
    requested.filter((relation) => allowed.includes(relation)).map((relation) => [relation, true]),
  );
  return Object.keys(include).length ? include : undefined;
}

export function toSearch(fields: string[], search?: string) {
  if (!search) return {};
  return { OR: fields.map((field) => ({ [field]: { contains: search, mode: 'insensitive' as const } })) };
}

export function toPagination(
  { page = 1, limit = 10, sortBy, order = 'desc' }: BaseQueryDto,
  sortable: string[],
) {
  return {
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { [sortable.includes(sortBy) ? sortBy : sortable[0]]: order },
  };
}
