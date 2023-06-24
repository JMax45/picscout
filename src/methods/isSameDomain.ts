const isSameDomain = (url1: string, url2: string) => {
  const parsedUrl1 = new URL(url1);
  const parsedUrl2 = new URL(url2);

  return parsedUrl1.hostname === parsedUrl2.hostname;
};

export default isSameDomain;
