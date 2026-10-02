// Keep existing workflows compatible with the description field.
export const normalizeEtlNodes = (nodes = []) => nodes.map((node) => {
  const { expression, ...data } = node.data || {};

  return {
    ...node,
    data: {
      ...data,
      description: data.description ?? (data.type === "sql" ? "" : expression ?? ""),
      ...(data.type === "sql" ? { sqlQuery: data.sqlQuery ?? expression ?? "" } : {}),
    },
  };
});
