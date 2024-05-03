export const fetchAPI = async ({ url, options }) => {
  try {
    const response = await fetch(url, {
      ...options,
    });

    if (!response.ok) {
      throw new Error('An error occurred while processing data with the API');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
};
