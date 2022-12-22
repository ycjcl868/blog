import { useMemo } from 'react'
import Link from 'next/link'

const Tags = ({ tags, currentTag }) => {
  const sortedTagKeys = useMemo(() => {
    return Object.keys(tags || {})?.sort((a) => {
      return a === currentTag ? -1 : 0
    })
  }, [tags, currentTag])

  if (!tags) return null

  return (
    <div className='tag-container'>
      <ul className='flex max-w-full mt-4 overflow-x-auto'>
        {sortedTagKeys.map((key) => {
          const selected = key === currentTag
          return (
            <li
              key={key}
              className={`mr-3 font-medium border whitespace-nowrap dark:text-gray-300 ${
                selected
                  ? 'text-white bg-black border-black dark:bg-gray-600 dark:border-gray-600'
                  : 'bg-gray-100 border-gray-100 text-gray-400 dark:bg-night dark:border-gray-800'
              }`}
            >
              <Link
                key={key}
                className='px-4 py-2 block'
                href={selected ? '/search' : `/tag/${encodeURIComponent(key)}`}
              >
                {`${key} (${tags[key]})`}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Tags
