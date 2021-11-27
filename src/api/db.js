// db.js
import Dexie from 'dexie';

export const db = new Dexie('eventDatabase');
db.version(1).stores({
  event: 'id, evName, setting, list, loadAt, expire', // Primary key and indexed props
});
