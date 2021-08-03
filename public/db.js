let db;
const request = indexedDB.open('OfflineDB', 11);

request.onupgradeneeded = function (e) {
  db = e.target.result;
  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('OfflineStore', { autoIncrement: true });
  }
};

request.onerror = function (e) {
  console.log(e.target.errorCode);
};

function checkDatabase() {
  console.log('check db');
  let transaction = db.transaction(['OfflineStore'], 'readwrite');
  const store = transaction.objectStore('OfflineStore');
  const getAll = store.getAll();
  getAll.onsuccess = function () {
    console.log("it works");
    if (getAll.result.length !== 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length > 0) {
            transaction = db.transaction(['OfflineStore'], 'readwrite');
            const currentStore = transaction.objectStore('OfflineStore');
            currentStore.clear();
            console.log('reset');
          }
        });
    }
  };
}

request.onsuccess = function (e) {
  console.log('successful');
  db = e.target.result;

  // Check if app is online before reading from db
  if (navigator.onLine) {
    console.log('status: online');
    checkDatabase();
  }
};

const saveRecord = (record) => {
  console.log('Save record');
  const transaction = db.transaction(['OfflineStore'], 'readwrite');
  const store = transaction.objectStore('OfflineStore');
  store.add(record);
};


window.addEventListener('online', checkDatabase);
