import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

import { Loader2 } from "lucide-react";

import Fuse from "fuse.js"; // Import the Fuse.js library

// Define a TypeScript interface for the project data
interface Blog {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  bannerImage: BannerImage;
  contributor: string;
  tag: string;
}

interface BannerImage {
  src: string;
}

export default function SearchDialog() {
  // State variables
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<Blog[]>([]); // An array to store project data
  const [filteredBlogs, setFilteredProjects] = useState<Blog[]>([]); // Filtered projects based on the search input
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error can be a string or null
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for the search query

  // Fuse.js options for searching projectTitle and projectDescription
  const fuseOptions = {
    keys: ["title", "description"],
  };

  // Function to close the modal
  function closeModal() {
    setIsOpen(false);
  }

  // Function to open the modal
  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null); // Reset error state before fetching data

      // Fetch data when the dialog is open
      fetch(`/api/search/blog.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((jsonData) => {
          setCollectionData(jsonData as Blog[]); // Type assertion to Blog[]
          setFilteredProjects(jsonData.slice(0, 3)); // Initialize filteredBlogs with the first 3 projects
        })
        .catch((err) => {
          setError(err.message);
          console.error("Error fetching data:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  // Function to handle search input changes
  function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearchQuery(query);

    // Use Fuse.js to filter projects based on the search query
    const fuse = new Fuse(collectionData, fuseOptions);
    const results = fuse.search(query);
    const filteredResults = results.map((result) => result.item);

    // Show all filtered projects when the search query is not empty
    setFilteredProjects(
      query === "" ? collectionData.slice(0, 3) : filteredResults,
    );
  }

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center justify-center gap-x-1.5  rounded-md border  border-border bg-background2 px-3.5 py-2.5 text-sm font-medium  leading-none text-sortText shadow-sm hover:bg-gray-50 hover:dark:bg-background "
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-textGray"
          stroke="currentColor"
        >
          <path
            d="M12.9141 12.9167L15.8307 15.8334"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.16406 9.16675C4.16406 11.9282 6.40264 14.1667 9.16406 14.1667C10.5472 14.1667 11.7991 13.6052 12.7043 12.6976C13.6064 11.7931 14.1641 10.5451 14.1641 9.16675C14.1641 6.40532 11.9255 4.16675 9.16406 4.16675C6.40264 4.16675 4.16406 6.40532 4.16406 9.16675Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Search
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/25 opacity-100 backdrop-blur transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-hidden">
            <div className="mt-10  flex  min-h-full items-start justify-center p-4 text-center md:mt-[96px]">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg    p-6 text-left align-middle  transition-all ">
                  <div className="relative">
                    <input
                      className="block w-full rounded-lg border  bg-background2 py-3 pl-4 pr-12 text-base text-textGray placeholder:text-para focus:outline-none sm:text-sm sm:leading-6"
                      placeholder="Search for projects"
                      value={searchQuery}
                      onChange={handleSearchInput}
                    />
                    <svg
                      className="pointer-events-none absolute right-4 top-3 h-6 w-6 fill-textGray"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.47 21.53a.75.75 0 1 0 1.06-1.06l-1.06 1.06Zm-9.97-4.28a6.75 6.75 0 0 1-6.75-6.75h-1.5a8.25 8.25 0 0 0 8.25 8.25v-1.5ZM3.75 10.5a6.75 6.75 0 0 1 6.75-6.75v-1.5a8.25 8.25 0 0 0-8.25 8.25h1.5Zm6.75-6.75a6.75 6.75 0 0 1 6.75 6.75h1.5a8.25 8.25 0 0 0-8.25-8.25v1.5Zm11.03 16.72-5.196-5.197-1.061 1.06 5.197 5.197 1.06-1.06Zm-4.28-9.97c0 1.864-.755 3.55-1.977 4.773l1.06 1.06A8.226 8.226 0 0 0 18.75 10.5h-1.5Zm-1.977 4.773A6.727 6.727 0 0 1 10.5 17.25v1.5a8.226 8.226 0 0 0 5.834-2.416l-1.061-1.061Z"></path>
                    </svg>{" "}
                  </div>

                  {isLoading ? (
                    <div className="mt-6 flex justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <div className="mt-6 rounded-lg bg-primary/10 px-6 py-4">
                      <h3 className="text-lg font-bold text-primary">
                        Something Bad Happened
                      </h3>
                      <p className="mt-1 line-clamp-4">{error}</p>
                    </div>
                  ) : isOpen ? (
                    <div className="mt-6 flex  max-h-[450px] flex-col   gap-y-5 overflow-y-auto lg:max-h-[600px]  xl:max-h-[600px]">
                      {filteredBlogs.length === 0 ? (
                        <p className="flex items-center justify-center">
                          No results found
                        </p>
                      ) : (
                        filteredBlogs.map((blog, index) => (
                          <BlocCard
                            key={index}
                            title={blog.title}
                            description={blog.description}
                            link={blog.link}
                            bannerImage={blog.bannerImage.src}
                            contributor={blog.contributor}
                            tag={blog.tag}
                            pubDate={blog.pubDate}
                          />
                        ))
                      )}
                    </div>
                  ) : null}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

const BlocCard = ({
  title,
  description,
  link,
  bannerImage,
  contributor,
  tag,
  pubDate,
}: {
  title: string;
  description: string;
  link: string;
  bannerImage: string;
  contributor: string;
  tag: string;
  pubDate: string;
}) => {
  return (
    <a href={`/blog/${link}`}>
      <div className="border-md flex w-full">
        <div className="hidden max-w-[180px] flex-shrink-0 overflow-hidden rounded-l-[8px]   sm:flex md:max-w-[257px]">
          <img
            width={600}
            height={600}
            src={bannerImage}
            className="aspect-video h-full object-cover"
          />
        </div>

        <div className=" w-full  items-center rounded-l-[8px] rounded-r-[8px] bg-background2 px-4 py-4   sm:rounded-l-none sm:px-2 md:px-6 md:py-6">
          <div className="flex items-center gap-x-2">
            <p className="text-[8px] font-medium leading-none text-cardGray">
              by {contributor}
            </p>

            <p className="rounded-full bg-[#E6E8EB] px-2  text-[8px]  font-medium text-cardGray">
              {tag}
            </p>
          </div>

          <h3 className="mt-2 text-[10px] font-bold md:text-xs">{title}</h3>

          <div className="sm:hidden md:block   ">
            <p className="mt-2 line-clamp-2   text-[10px] ">{description}</p>
          </div>

          <p className="mt-2 inline-flex items-center text-[8px] font-medium text-cardGray">
            5 Min Read
            <span className="mx-1  block h-0.5 w-0.5 rounded-full bg-para"></span>
            <span className="text-[8px] text-cardGray">{pubDate}</span>
          </p>
        </div>
      </div>
    </a>
  );
};

// <div className="flex cursor-pointer items-center justify-between rounded-lg bg-white  p-4  hover:text-primary md:px-6 md:py-4 ">
//         <div className="w-[85%]">
//           <h3 className="text-base font-medium md:text-base">{title}</h3>
//           <p
//             className="mt-1 line-clamp-2  text-sm md:text-sm   "
//             dangerouslySetInnerHTML={{ __html: description }}
//           ></p>
//         </div>
//         <div>
//           <ChevronRightIcon className="h-5 w-5 md:h-8 md:w-8 " />
//         </div>
//       </div>

const SearchIcon = () => {
  return (
    <>
      <div className="hidden md:block">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.498 15.5L18.998 19"
            stroke="#272540"
            strokeWidth="1.17434"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M5 11C5 14.3137 7.68629 17 11 17C12.6597 17 14.1621 16.3261 15.2483 15.237C16.3308 14.1517 17 12.654 17 11C17 7.68629 14.3137 5 11 5C7.68629 5 5 7.68629 5 11Z"
            stroke="#272540"
            strokeWidth="1.17434"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </div>

      <div className="block md:hidden">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.334 10.333L12.6673 12.6663"
            stroke="#272540"
            strokeWidth="1.17434"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M3.33398 7.33301C3.33398 9.54215 5.12485 11.333 7.33398 11.333C8.44047 11.333 9.44202 10.8837 10.1662 10.1577C10.8878 9.43411 11.334 8.43566 11.334 7.33301C11.334 5.12387 9.54312 3.33301 7.33398 3.33301C5.12485 3.33301 3.33398 5.12387 3.33398 7.33301Z"
            stroke="#272540"
            strokeWidth="1.17434"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </div>
    </>
  );
};
