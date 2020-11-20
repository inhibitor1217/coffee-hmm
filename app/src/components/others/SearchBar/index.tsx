import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SearchValueContext from '../../../context';
import { letterValidation } from '../../../utils/function';
import './index.css';

const SearchBar = () => {
    const location = useHistory();
    const [target, setTarget] = useState<string>("");
    const {setSearchValue} = useContext(SearchValueContext)

    async function setContext(){
        const targetProcessed = target.replace(/\s+/g, ''); 
        await setSearchValue(targetProcessed);
        setTarget("");
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTarget(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const targetProcessed = target.replace(/\s+/g, ''); 
        if(targetProcessed !== undefined && letterValidation(targetProcessed)){
            setContext();
            location.push("/search");
        }
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div className="search-bar">
                    <i className="material-icons-round search-icon">search</i>
                    <input type="text" value={target} onChange={onChange} maxLength={14}/>
                </div>
            </form>
        </div>
    )
}

export default SearchBar;