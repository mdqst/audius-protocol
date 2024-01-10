import { useState } from 'react'
import useReleases from 'providers/useReleases'

const Releases = () => {
  const [statusFilter, setStatusFilter] = useState('')
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined)
  const { data, error, isPending } = useReleases(
    statusFilter,
    nextCursor,
    prevCursor
  )

  const handleNext = () => {
    if (data && data.length) {
      const lastItem = data[data.length - 1]
      setNextCursor(`${lastItem.release_date},${lastItem.id}`)
      setPrevCursor(undefined)
    }
  }

  const handlePrev = () => {
    if (data && data.length) {
      const firstItem = data[0]
      setPrevCursor(`${firstItem.release_date},${firstItem.id}`)
      setNextCursor(undefined)
    }
  }

  return (
    <>
      <h1>Releases</h1>
      <div>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 mx-1"
          onClick={() =>
            setStatusFilter((curFilter) =>
              curFilter === 'success' ? '' : 'success'
            )
          }
        >
          Success
          {statusFilter === 'success' && <CheckCircleIcon aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 mx-1"
          onClick={() =>
            setStatusFilter((curFilter) =>
              curFilter === 'processing' ? '' : 'processing'
            )
          }
        >
          Processing
          {statusFilter === 'processing' && (
            <CheckCircleIcon aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
          onClick={() =>
            setStatusFilter((curFilter) =>
              curFilter === 'error' ? '' : 'error'
            )
          }
        >
          Error
          {statusFilter === 'error' && <CheckCircleIcon aria-hidden="true" />}
        </button>
      </div>
      {isPending && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Release Date</th>
              <th>Artist Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((release) => (
              <tr key={release.id}>
                <td>{release.id}</td>
                <td>{release.data.title}</td>
                <td>{release.data.genre}</td>
                <td>{release.release_date.toLocaleString()}</td>
                <td>{release.data.artistName}</td>
                <td>{release.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 mx-1"
          onClick={handlePrev}
          disabled={!prevCursor}
        >
          Previous
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 float-right"
          onClick={handleNext}
          disabled={!nextCursor && (!data || data.length === 0)}
        >
          Next
        </button>
      </div>
    </>
  )
}

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="-mr-0.5 h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
)

export default Releases
