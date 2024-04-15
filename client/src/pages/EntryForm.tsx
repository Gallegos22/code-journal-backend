import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type Entry,
  addEntry,
  readEntry,
  removeEntry,
  updateEntry,
} from '../data';

/**
 * Form that adds or edits an entry.
 * Gets `entryId` from route.
 * If `entryId` === 'new' then creates a new entry.
 * Otherwise reads the entry and edits it.
 */
export function EntryForm() {
  const { entryId } = useParams();
  const [entry, setEntry] = useState<Entry>();
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const isEditing = entryId && entryId !== 'new';

  useEffect(() => {
    async function load(id: number) {
      setIsLoading(true);
      try {
        const entry = await readEntry(id);
        if (!entry) throw new Error(`Entry with ID ${id} not found`);
        setEntry(entry);
        setPhotoUrl(entry.photoUrl);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing) load(+entryId);
  }, [entryId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newEntry = Object.fromEntries(formData) as unknown as Entry;
    if (isEditing) {
      updateEntry({ ...entry, ...newEntry });
    } else {
      addEntry(newEntry);
    }
    navigate('/');
  }

  function handleDelete() {
    if (!entry?.entryId) throw new Error('Should never happen');
    removeEntry(entry.entryId);
    navigate('/');
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Entry with ID {entryId}:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-span-1 flex justify-between">
          <h1>{isEditing ? 'Edit Entry' : 'New Entry'}</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row mb-1">
          <div className="columns-1 w-1/2">
            <img
              className="rounded max-h-48 mb-4 block ml-auto mr-auto aspect-auto"
              src={photoUrl || '/images/placeholder-image-square.jpg'}
              alt="entry"
            />
          </div>
          <div className="columns-1 w-1/2">
            <label className="mb-1 block">
              Title
              <input
                name="title"
                defaultValue={entry?.title ?? ''}
                required
                className="border-gray-400 border p-2 rounded h-10 mb-8 w-full block"
                type="text"
              />
            </label>
            <label className="mb-1 block">
              Photo URL
              <input
                name="photoUrl"
                defaultValue={entry?.photoUrl ?? ''}
                required
                className="border-gray-400 border p-2 rounded h-10 mb-8 w-full block"
                type="text"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="row mb-1">
          <div className="columns-1 w-full">
            <label className="mb-1 block">
              Notes
              <textarea
                name="notes"
                defaultValue={entry?.notes ?? ''}
                required
                className="border-gray-400 border p-2 rounded mb-8 block w-full"
                cols={30}
                rows={10}
              />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="columns-1 w-full flex justify-between">
            {isEditing && (
              <button
                className="delete-entry-button"
                type="button"
                onClick={() => setIsDeleting(true)}>
                Delete Entry
              </button>
            )}
            <button className="p-2 rounded text-white bg-purple-900">
              SAVE
            </button>
          </div>
        </div>
      </form>
      {isDeleting && (
        <div
          id="modalContainer"
          className="modal-container flex justify-center items-center">
          <div className="modal row">
            <div className="columns-1 flex justify-center w-full px-3">
              <p>Are you sure you want to delete this entry?</p>
            </div>
            <div className="columns-1 flex justify-between w-full px-3">
              <button
                className="modal-button"
                onClick={() => setIsDeleting(false)}>
                Cancel
              </button>
              <button
                className="modal-button bg-[#dc2626] text-white"
                onClick={handleDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
