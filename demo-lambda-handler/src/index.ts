import KeyValueStorage from './key-value-storage';

export const handler = async function(event: any) {
  console.log(`executing lambda handler: ${JSON.stringify(event)}`);
  const { operation, key, data } = event;

  const keyValueStorage = new KeyValueStorage({ framework: 'nuxt' });
  if (operation === 'get') {
    return await keyValueStorage.get(key);
  } else if (operation === 'set') {
    await keyValueStorage.set(key, data);
  } else {
    throw new Error(`Unknown operation: ${operation}`);
  }
};
