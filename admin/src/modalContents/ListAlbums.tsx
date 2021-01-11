import React, { useState } from 'react';

type ListAlbumsProps = {
    imageFolderList: AWS.S3.ListObjectsOutput;
    createAlbum: (name: string) => void;
    deleteAlbum: (name: string) => void;
    viewAlbum: (albumName: string) => void;
    setViewAlbum: (isViewAlbum: boolean) => void;
}

const ListAlbums = ({imageFolderList, createAlbum, deleteAlbum, viewAlbum, setViewAlbum}: ListAlbumsProps) => {        
    const [newCafe, setNewCafe] = useState<string>("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCafe(e.target.value);
    }

    const handleViewClick = (albumName: string) => {
        setViewAlbum(true);
        viewAlbum(albumName);
    }

    const handleSubmitClick = (albumName: string) => {
        createAlbum(albumName);
    }

    if(imageFolderList.CommonPrefixes === undefined){
        return(
            <div>
                <div>You don't have any albums. You need to create an album.</div>
                <form action="">
                    <input type="text" placeholder="카페이름" onChange={onChange}/>
                    <button onClick={() => handleSubmitClick(newCafe)}>Create new album</button>
                </form>
            </div>
        )
    }else{
        return(
        <div>
            {imageFolderList.CommonPrefixes.map((commonPrefix: AWS.S3.CommonPrefix, index) => {
                let prefix = commonPrefix.Prefix;
                let albumName = decodeURIComponent((prefix === undefined? "" : prefix).replace("/", ""));
                return(
                    <div key={index}>
                        <li onClick={() => deleteAlbum(albumName)}><span>DELETE</span></li>
                        <li onClick={() => handleViewClick(albumName)}><span>{albumName}</span></li>
                    </div>
                )
            })}
            <form action="">
                <input type="text" placeholder="카페이름" onChange={onChange}/>
                <button onClick={() => handleSubmitClick(newCafe)}>Create new album</button>
            </form>
        </div>
        )       
    } 
}

export default ListAlbums;