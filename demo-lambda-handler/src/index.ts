const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const simulateGenerateAndSetData = async () => {
  console.log('simulateGenerateAndSetData: sleeping for 10 seconds...');
  await sleep(10_000);
  const response = await fetch('http://127.0.0.1:8888/set', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: 'Hello, World!' })
  });
  const data = await response.json();
  console.log(`set response: ${JSON.stringify(data)}`);
};

export const handler = async function(event: any) {
  console.log('handler: fetching data...');
  const response = await fetch('http://127.0.0.1:8888/get');
  await simulateGenerateAndSetData();

  const data = await response.json();
  console.log(`get response: ${JSON.stringify(data)}`);
};