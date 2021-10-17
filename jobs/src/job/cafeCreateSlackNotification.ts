export const handler = (event: any) => {
  return Promise.resolve({
    statusCode: 200,
    body: event.Records[0].body,
  });
};
