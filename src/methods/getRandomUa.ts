import UserAgent from 'user-agents';

const getRandomUa = () => {
  const userAgent = new UserAgent();
  return userAgent.toString();
};

export default getRandomUa;
