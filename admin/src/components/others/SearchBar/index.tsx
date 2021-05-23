import React, { useState } from 'react';
import './index.css';

type SearchBarProps = {
    placeHolder: string;
    setSearchTarget: (searchTarget: string) => void;
}

const SearchBar = ({placeHolder, setSearchTarget}: SearchBarProps) => {
    const [target, setTarget] = useState<string>("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchTarget(target);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setTarget(e.target.value);
    }

    return(
        <div className="search-bar-wrapper">
            <form onSubmit={handleSubmit}>
                <input type="text" value={target} maxLength={20} placeholder={placeHolder} onChange={onChange}/>
                <i className="material-icons search-icon">search</i>
                <button type="submit">검색</button>
            </form>
        </div>
    )
}

export default SearchBar;