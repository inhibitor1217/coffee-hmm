import {createContext} from 'react';

export const SearchValueCtx = createContext({
    searchValueCtx: "",
    setSearchValueCtx: (data: string) => {}
})