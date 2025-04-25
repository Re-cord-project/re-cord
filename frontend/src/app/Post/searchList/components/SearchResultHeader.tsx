import React from 'react'

interface SearchResultHeaderProps {
    searchQuery: string
    totalResults: number
}

const SearchResultHeader: React.FC<SearchResultHeaderProps> = ({ searchQuery, totalResults }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">"{searchQuery}" 검색결과</h1>
            <p className="text-gray-600 mb-4">총 {totalResults}건의 검색결과</p>
        </div>
    )
}

export default SearchResultHeader
