const REDIS_TIMEOUT_MS = 5000;

async function fetchRedisJson(url, options = {}) {
  const controller = new AbortController();
  let timer;
  const request = fetch(url, { ...options, signal: controller.signal })
    .then(async response => ({
      response,
      payload: response.ok ? await response.json() : null
    }));
  const timeout = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      const error = new Error('REDIS_TIMEOUT');
      error.code = 'REDIS_TIMEOUT';
      reject(error);
    }, REDIS_TIMEOUT_MS);
  });

  try {
    return await Promise.race([request, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { fetchRedisJson, REDIS_TIMEOUT_MS };
