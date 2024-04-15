import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import { Entry, readEntries } from '../data';

export function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function load() {
      try {
        const entries = await readEntries();
        setEntries(entries);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Entries:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="columns-1 flex justify-between items-center w-full px-3 mb-4">
          <h1 className='text-3xl'>Entries</h1>
          <h3>
            <Link to="/details/new" className="text-white rounded py-2 px-4 bg-purple-900">
              NEW
            </Link>
          </h3>
        </div>
      </div>
      <div className="row">
        <div className="columns-1 w-full px-3 py-0">
          <ul className="entry-ul">
            {entries.map((entry) => (
              <EntryCard key={entry.entryId} entry={entry} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

type EntryProps = {
  entry: Entry;
};
function EntryCard({ entry }: EntryProps) {
  return (
    <li>
      <div className="row">
        <div className="columns-1 w-1/2">
          <img
            className="rounded max-h-48 mb-4 block ml-auto mr-auto aspect-auto"
            src={entry.photoUrl}
            alt=""
          />
        </div>
        <div className="columns-1 w-1/2">
          <div className="row">
            <div className="columns-1 w-full flex justify-between">
              <h3 className='font-bold'>{entry.title}</h3>
              <Link to={`details/${entry.entryId}`}>
                <FaPencilAlt />
              </Link>
            </div>
          </div>
          <p>{entry.notes}</p>
        </div>
      </div>
    </li>
  );
}
