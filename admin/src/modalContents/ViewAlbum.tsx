import React, { useState } from 'react';
import { TypeAWSPhoto } from '../utils/Type';


type ViewAlbumProps = {
    setViewAlbum: (isViewAlbum: boolean) => void;
    photoList: TypeAWSPhoto[];
    addPhoto: (albumName: string, file: File) => void;
    deletePhoto: (albumName: string, photoKey: string) => void;
}

const ViewAlbum = ({ setViewAlbum, photoList, addPhoto, deletePhoto }: ViewAlbumProps) => {
    const [files, setFiles] = useState<File>();
    
    if(photoList.length === 0){
        return(
            <div>No Image</div>
        )
    }
        
    const album = photoList[0].album; 
   
    const onChange = (e: any) => {
        const files = e.target.files; //FileList
        setFiles(files[0]);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!files) return;

        e.preventDefault();
        addPhoto(album, files);
    }

    return(
        <div>
            <button onClick={() => setViewAlbum(false)}><i className="material-icons">arrow_back</i></button>
            <h2>Album: {album}</h2>
            <div>
                {photoList.map((photo, index) => {
                    if(!photo.photoKey){
                        return(
                            <div>No Photo</div>
                        )
                    }
                    return(
                        <div key={index}>
                            <img src={photo.photoUrl} alt="" style={{width: "128px", height: "128px"}}/>
                            <span onClick={() => deletePhoto(album, photo.photoKey === undefined? "":photo.photoKey)}>DELETE</span>
                            <span>{photo.photoKey?.replace(photo.albumPhotosKey, "")}</span>
                        </div>
                    )
                })}
            </div>
            <form onSubmit={handleSubmit}>
                <input id="photoupload" type="file" accept="image/*" onChange={onChange.bind(this)}/>
                <button type="submit">Add photo</button>
            </form>    
        </div>
    )   
}

export default ViewAlbum;