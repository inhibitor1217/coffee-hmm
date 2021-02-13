import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { letterValidation } from '../../../utils/function';
import './index.css';

const SearchBar = () => {
    const location = useHistory();
    const [target, setTarget] = useState<string>("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTarget(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const targetProcessed = target.replace(/\s+/g, ''); 
        if(targetProcessed !== undefined && letterValidation(targetProcessed)){
            location.push(`/place/${targetProcessed}`);
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