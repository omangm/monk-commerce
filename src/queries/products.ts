export const fetchProducts = async (search: string, page: number) => {
  const response = await fetch(
    `https://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${page}&limit=10`,
    {
      headers: { "x-api-key": import.meta.env.VITE_API_KEY },
    }
  );
  return response.json();
};

