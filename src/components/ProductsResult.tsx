import { fetchProducts } from "@/queries/products";
import { debounce } from "@/utils/debounce";
import { useEffect, useRef, useState } from "react";

interface IProduct {
  id: string;
  title: string;
}

const ProductsResult = ({ query }: { query: string }) => {
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [areAllResultsFetched, setAreAllResultsFetched] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const initialLoad = useRef(true);

  const fetchSearchResults = async (searchQuery: string, pageNum: number) => {
    try {
      setIsLoading(true);
      const response = await fetchProducts(searchQuery, pageNum);
      
      // If we get null (204 status), mark all as fetched
      if (response === null) {
        setAreAllResultsFetched(true);
        // Only clear results if it's the first page
        if (pageNum === 1) {
          setSearchResults([]);
        }
        return;
      }

      // If we get an empty array or fewer items than expected, mark all as fetched
      if (response.length === 0) {
        setAreAllResultsFetched(true);
      }

      setSearchResults(prev => pageNum === 1 ? response : [...prev, ...response]);
    } catch (error) {
      console.error('Error fetching products:', error);
      // On error, keep existing results but stop pagination
      setAreAllResultsFetched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce((searchQuery: string) => {
    if (searchQuery.length <= 0) {
      setSearchResults([]);
      setAreAllResultsFetched(false);
      setPage(1);
      return;
    }
    // Reset pagination state for new search
    setPage(1);
    setAreAllResultsFetched(false);
    fetchSearchResults(searchQuery, 1);
  }, 750);

  useEffect(() => {
    if (!initialLoad.current) {
      debouncedSearch(query);
    }
    initialLoad.current = false;

    return () => {
      // Clean up any pending debounced calls
      // debouncedSearch.cancel?.();
    };
  }, [query]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        if (
          isVisible && 
          !isLoading && 
          !areAllResultsFetched && 
          query.length > 2 &&
          searchResults.length > 0
        ) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchSearchResults(query, nextPage);
        }
      },
      { 
        threshold: 0.1,  // Reduced threshold for earlier trigger
        rootMargin: '100px' // Load more content before reaching the end
      }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
      observer.disconnect();
    };
  }, [query, page, isLoading, areAllResultsFetched, searchResults.length]);

  const renderContent = () => {
    if (isLoading && page === 1) {
      return <p className="text-center text-gray-500 py-4">Searching...</p>;
    }

    if (searchResults.length === 0 && query.length > 2 && !isLoading) {
      return <p className="text-center text-gray-500 py-4">No products found</p>;
    }

    return (
      <>
        {searchResults.map((result) => (
          <div className="py-4 border-b" key={result.id}>
            <p>{result.title}</p>
          </div>
        ))}
        
        {!areAllResultsFetched && searchResults.length > 0 && (
          <div 
            ref={observerRef} 
            className="h-10 flex items-center justify-center"
          >
            {isLoading ? (
              <p className="text-gray-500">Loading more products...</p>
            ) : (
              <p className="text-gray-400">Scroll for more</p>
            )}
          </div>
        )}

        {areAllResultsFetched && searchResults.length > 0 && (
          <p className="text-center text-gray-500 py-4">No more products to load</p>
        )}
      </>
    );
  };

  return (
    <div className="p-4 h-[60vh] overflow-auto border-t border-black border-opacity-10">
      {renderContent()}
    </div>
  );
};

export default ProductsResult;