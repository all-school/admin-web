import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import client from '@/graphql/client';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, User, Users, BookOpen } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';

const GET_STUDENT_ID_BY_NAME = gql`
  query search($searchType: [SearchType!]!, $text: String!) {
    search(searchType: $searchType, text: $text) {
      __typename
      ... on Group {
        id
        name
        profilePicture {
          id
          fileName
          contentType
          objectKey
          url
          signedUrl
        }
      }
      ... on Student {
        id
        firstName
        lastName
        profilePicture {
          id
          fileName
          contentType
          objectKey
          url
          signedUrl
        }
      }
      ... on Teacher {
        id
        firstName
        lastName
        profilePicture {
          id
          fileName
          contentType
          objectKey
          url
          signedUrl
        }
      }
    }
  }
`;

const SchoolSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const router = useRouter();
  const searchRef = useRef(null);

  const executeSearch = useCallback(async () => {
    if (debouncedSearchQuery) {
      setIsLoading(true);
      try {
        const { data } = await client.query({
          query: GET_STUDENT_ID_BY_NAME,
          variables: {
            searchType: ['STUDENT', 'TEACHER', 'GROUP'],
            text: debouncedSearchQuery
          }
        });
        setSearchResults(data.search);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    executeSearch();
  }, [debouncedSearchQuery, executeSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = (result) => {
    if (result.__typename === 'Student') {
      router.push(`/admin/school/student/${result.id}`);
    } else if (result.__typename === 'Teacher') {
      router.push(`/admin/school/teacher/${result.id}`);
    } else if (result.__typename === 'Group') {
      router.push(`/admin/school/group/${result.id}`);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Student':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'Teacher':
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'Group':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Input
          type="search"
          placeholder="Search students, teachers, or groups..."
          className="w-[400px] rounded-full border-2 border-blue-300 py-2 pl-10 pr-4 transition-all duration-300 ease-in-out focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
      </div>
      {searchResults.length > 0 && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <ScrollArea className="max-h-[300px]">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="flex cursor-pointer items-center p-3 transition-colors duration-150 ease-in-out hover:bg-gray-100"
                onClick={() => handleResultClick(result)}
              >
                <Avatar className="mr-3 h-10 w-10">
                  <AvatarImage
                    src={result.profilePicture?.signedUrl}
                    alt={`${result.firstName} ${result.lastName}`}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {result.__typename === 'Group'
                      ? result.name.substring(0, 2).toUpperCase()
                      : getInitials(result.firstName, result.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900">
                    {result.__typename === 'Group'
                      ? result.name
                      : `${result.firstName} ${result.lastName}`}
                  </p>
                  <p className="flex items-center text-xs text-gray-500">
                    {getTypeIcon(result.__typename)}
                    <span className="ml-1">{result.__typename}</span>
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default SchoolSearch;
