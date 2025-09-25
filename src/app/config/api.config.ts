type Stage = 'test' | 'prod';

//alterar ambiente
const STAGE: Stage = 'test';

const ENDPOINTS = {
  test: 'http://127.0.0.1:3001',             
  prod: '',  
} as const;

export const API_BASE = ENDPOINTS[STAGE].replace(/\/+$/, '');
