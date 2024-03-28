import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

export default function BrandDropdown({ data, onBrandsChange }) {
  
  let people = (Array.from(new Set(data.map(entry => entry.brand))))
  const [selectedPeople, setSelectedPeople] = useState(people.sort())
  const [query, setQuery] = useState('')

  
  const allSelected = selectedPeople.length === people.length

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) =>
          person.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
      )

    const handleChange = (brands) => {
      setSelectedPeople(brands)
      onBrandsChange(brands)
    }
  return (
  <div className="w-48 2xl:w-64">
    <Combobox value={selectedPeople} onChange={handleChange} multiple>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(person) => person.name}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brands..."
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <div className="flex items-center justify-between px-4">
              <button
                type="button"
                onClick={() => handleChange(people)}
                className="text-sm font-medium text-teal-600 hover:text-teal-500 focus:outline-none"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => handleChange([])}
                className="text-sm font-medium text-teal-600 hover:text-teal-500 focus:outline-none"
              >
                Clear
              </button>
            </div>
            {filteredPeople.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredPeople.map((brand) => (
                <Combobox.Option
                  key={brand}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-teal-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={brand}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {brand}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teal-600'
                          }`}
                        >
                          <CheckIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  </div>
);
}