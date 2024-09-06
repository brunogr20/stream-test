const LogItemsToHide = {
  body: ['password'],
  query: [],
  params: ['password'],
  header: ['authorization2', 'authhash2'],
  urls: [
    {
      url: '/bff/healthcheck',
      method: 'get',
    },
  ],
};

export default LogItemsToHide;
