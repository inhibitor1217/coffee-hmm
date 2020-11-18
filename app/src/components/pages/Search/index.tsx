import React from 'react';
import SearchValueContext from '../../../context';
import CafeList from '../../others/CafeList';

const Search = () => {
    return( 
    <SearchValueContext.Consumer>
    {context => {
        return(
            <CafeList searchValue={context.searchValue}/>
        )
    }}
    </SearchValueContext.Consumer>
    )
}

export default Search;