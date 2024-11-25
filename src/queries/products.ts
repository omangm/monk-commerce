export const fetchProducts = async (search: string, page: number) => {
  console.log(page);
  
  const response = await fetch(
    `http://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${page}&limit=10`,
    {
      headers: { "x-api-key": import.meta.env.VITE_API_KEY },
    }
  );
  return response.json();
};

