export const resizeImage = (url: string, size: string) => {
	// Extract the base URL and query parameters
	const [baseUrl, queryParams] = url.split("?");

	// Add size before the file extension
	const updatedUrl = baseUrl.replace(/(\.jpg|\.png|\.webp)/, `_${size}$1`);

	// Append query params back if they exist
	return queryParams ? `${updatedUrl}?${queryParams}` : updatedUrl;
};
