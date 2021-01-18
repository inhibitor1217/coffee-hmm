import React from 'react';
import { SearchValueCtx } from '../../../context';
import CafeList from '../../others/CafeList';

const Search = () => {
    return( 
    <SearchValueCtx.Consumer>
    {context => {
        return(
            <CafeList searchValue={context.searchValueCtx}/>
        )
    }}
    </SearchValueCtx.Consumer>
    )
}

export default Search;