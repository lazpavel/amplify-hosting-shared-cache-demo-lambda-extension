import axios from 'axios';

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const simulateGenerateAndSetData = async () => {
  await sleep(10_000);
  const setResponse = await axios.post('http://localhost:3000/set', { data: 'Hello, World!' });
  console.log(`set response: ${JSON.stringify(setResponse)}`);
};

export const handler = async function(event: any) {
  const getResponse = await axios.get('http://localhost:3000/get');
  await simulateGenerateAndSetData();

  console.log(`get response: ${JSON.stringify(getResponse)}`);
};