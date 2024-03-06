const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const simulateGenerateAndSetData = async () => {
  console.log('simulateGenerateAndSetData: sleeping for 10 seconds...');
  // await sleep(10_000);
  const response = await fetch('http://127.0.0.1:8888/set', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: 'Hello, World!' })
  });
  
  console.log(`set response completed`);
};

export const handler = async function(event: any) {
  console.log('handler: fetching data...');
  const response = await fetch('http://127.0.0.1:8888/get');
  simulateGenerateAndSetData();

  console.log(`get response completed`);
  return null;
};