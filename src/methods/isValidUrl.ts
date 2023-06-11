const isValidUrl = (inputUrl: string) => {
  try {
    new URL(inputUrl);
    return true;
  } catch (error) {
    return false;
  }
};

export default isValidUrl;
