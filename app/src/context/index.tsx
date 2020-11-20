import {createContext} from 'react';

const SearchValueContext = createContext({
    searchValue: "",
    setSearchValue:(data: string)=>{}
})

export default SearchValueContext;