export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

// type Data = {
//   entries: Entry[];
//   nextEntryId: number;
// };

// const dataKey = 'code-journal-data';

// function readData(): Data {
//   let data: Data;
//   const localData = localStorage.getItem(dataKey);
//   if (localData) {
//     data = JSON.parse(localData);
//   } else {
//     data = {
//       entries: [],
//       nextEntryId: 1,
//     };
//   }
//   return data;
// }

// function writeData(data: Data): void {
//   const dataJSON = JSON.stringify(data);
//   localStorage.setItem(dataKey, dataJSON);
// }

export async function readEntries(): Promise<Entry[]> {
  //reading/get all entries
  const response = await fetch('/api/entries');
  if (!response.ok) {
    throw new Error(`fetch error ${response.status}`);
  }
  const entries = await response.json();
  return entries;
}

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  //reading/get single entry
  const response = await fetch(`/api/entries/${entryId}`);
  if (!response.ok) {
    throw new Error(`fetch error ${response.status}`);
  }
  const entry = await response.json();
  return entry;
}

export async function addEntry(entry: Entry): Promise<Entry> {
  //creating a new entry with post
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  };
  const response = await fetch('/api/entries', req);
  if (!response.ok) {
    throw new Error(`fetch error ${response.status}`);
  }
  const newEntry = await response.json();
  return newEntry;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  //updating/put an entry
  const req = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  };
  const response = await fetch(`/api/entries/${entry.entryId}`, req);
  if (!response.ok) {
    throw new Error(`fetch error ${response.status}`);
  }
  const updatedEntry = await response.json();
  return updatedEntry;
}

export async function removeEntry(entryId: number): Promise<void> {
  const req = {
    method: 'DELETE',
  };
  const response = await fetch(`/api/entries/${entryId}`, req);
  if (!response.ok) {
    throw new Error(`fetch error ${response.status}`);
  }
}
