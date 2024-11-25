const fetchProducts = async ({ pageParam = 0, queryKey }: any) => {
  const [_, search] = queryKey;
  const response = await fetch(
    `http://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${pageParam}&limit=10`,
    {
      headers: { "x-api-key": "your-api-key" },
    }
  );
  return response.json();
};