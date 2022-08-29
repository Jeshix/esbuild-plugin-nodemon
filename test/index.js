import esm from './esm.js';
import commonJs from './cjs.js';

(async () => {
  await esm();
  await commonJs();
})();
