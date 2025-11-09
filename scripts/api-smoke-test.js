import dotenv from 'dotenv';
import { api, apiWithToken } from '../config/config.js';

dotenv.config();

const run = async () => {
  console.log('API baseURL:', api.defaults.baseURL);

  const checks = [
    { name: 'List institutions', fn: () => api.get('/institutions') },
    { name: 'Institutions count', fn: () => api.get('/institutions/count') },
    { name: 'List migrant manuals', fn: () => api.get('/migrant-manuals') },
    { name: 'List terms', fn: () => api.get('/terms') },
  ];

  for (const check of checks) {
    process.stdout.write(`Running: ${check.name} ... `);
    try {
      const res = await check.fn();
      const status = res.status;
      const shape = Object.keys(res.data).slice(0, 5);
      console.log(`OK (${status}) keys: ${shape.join(', ')}`);
    } catch (err) {
      if (err.response) {
        console.log(`FAIL (HTTP ${err.response.status}) - ${JSON.stringify(err.response.data)}`);
      } else {
        console.log('FAIL -', err.message);
      }
    }
  }

  // Try auth login if env vars provided
  if (process.env.SMOKE_ADMIN_EMAIL && process.env.SMOKE_ADMIN_PASSWORD) {
    process.stdout.write('Attempting admin login ... ');
    try {
      const resp = await api.post('/auth/admins/login', { email: process.env.SMOKE_ADMIN_EMAIL, password: process.env.SMOKE_ADMIN_PASSWORD });
      const token = resp.data.token || resp.data.data?.token;
      if (token) {
        console.log('OK - token received');
        const authApi = apiWithToken(token);
        const r = await authApi.get('/migrants/profile');
        console.log('Profile fetch OK - keys:', Object.keys(r.data).slice(0,5));
      } else {
        console.log('FAIL - no token in response');
      }
    } catch (err) {
      if (err.response) console.log(`FAIL (HTTP ${err.response.status}) - ${JSON.stringify(err.response.data)}`);
      else console.log('FAIL -', err.message);
    }
  } else {
    console.log('Skipping admin login check (set SMOKE_ADMIN_EMAIL and SMOKE_ADMIN_PASSWORD to enable)');
  }
};

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(2); });
