const constructQueryFilter = (
  filterFlag: string | undefined
): { filter?: string | null; limit?: null; orderBy?: null } => {
  if (typeof filterFlag === 'string') {
    if (filterFlag.length === 0) {
      return {
        filter: null,
        limit: null,
        orderBy: null,
      };
    } else {
      return { filter: filterFlag };
    }
  }
  return {};
};

export { constructQueryFilter };
