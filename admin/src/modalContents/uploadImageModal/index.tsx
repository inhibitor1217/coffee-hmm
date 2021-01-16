import React, { useEffect, useState } from 'react';
import './index.css';
import AWS from 'aws-sdk';
import ListAlbums from '../ListAlbums';
import ViewAlbum from '../ViewAlbum';
import { TypeAWSPhoto } from '../../utils/Type';

export const ALBUM_BUCKET = '';
const REGION = 'ap-northeast-2';
const CREDENTIALS_IDENTITY_POOL_ID = '';

type UploadImageModalProps = {
    setModalOpen: (isModalOpen: boolean) => void;
    setUploadImage: (isUploadImage: boolean) => void;
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({setModalOpen, setUploadImage}) => {
    const [isViewAlbum, setViewAlbum] = useState<boolean>(false);
    const [currentS3, setCurrentS3] = useState<AWS.S3>();
    const [imageFolderList, setImageFolderList] = useState<AWS.S3.ListObjectsOutput>({});
    const [photoList, setPhotoList] = useState<TypeAWSPhoto[]>([]);
    

    const handleClick = () => {
        setUploadImage(false);
        setViewAlbum(false);
        setModalOpen(false);
    }

    useEffect(() => {
        async function connection() {
            AWS.config.region = REGION;
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: CREDENTIALS_IDENTITY_POOL_ID,
            });
        }
        connection();
        
        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: {
                Bucket: ALBUM_BUCKET
            }
        });
        setCurrentS3(s3);

        s3.listObjects({ Delimiter: "/", Bucket: ALBUM_BUCKET}, function(err, data){
            if (err) {
                return alert("There was an error listing your albums: " + err.message);
            }    
            setImageFolderList(data);  
        })
    }, [])

    async function createAlbum(name: string) {
        const albumName = name.trim();
        if (!albumName) {
            return alert("Album names must contain at least one non-space character.");
        }
        if (albumName.indexOf("/") !== -1) {
            return alert("Album names cannot contain slashes.");
        }

        const albumKey = encodeURIComponent(albumName) + "/";
        try{
            currentS3?.putObject({ Bucket: ALBUM_BUCKET, Key: albumKey }, function(err, data) {
                if (err) {
                    return alert("There was an error creating your album: " + err.message);
                }
                alert("Successfully created album.");
            });
        }catch(e){
            alert(e);
        }   
    }

    async function deleteAlbum(name: string) {
        const albumKey = encodeURIComponent(name) + "/";
        try{
            currentS3?.listObjects({ Prefix: albumKey, Bucket: ALBUM_BUCKET }, function(err, data) {
                if (err) {
                    alert("There was an error deleting your album: " + err.message);
                }
            
                let objects = data.Contents?.map(function(object) {
                    return { Key: (object.Key === undefined? "" : object.Key) };
                });

                if(objects === undefined){
                    alert("There was an error deleting your album.");
                }else{
                    currentS3.deleteObjects(
                        {
                            Delete: { Objects: objects, Quiet: true },
                            Bucket: ALBUM_BUCKET
                        },
                        function(err, data) {
                            if (err) {
                                return alert("There was an error deleting your album: " + err.message);
                            }
                            alert("Successfully deleted album.");
                        }
                    );
                } 
            });
        }catch(e){
            alert(e);
        }
    }

    async function viewAlbum(albumName: string) {
        const albumPhotosKey = encodeURIComponent(albumName) + "/";
        try{
            currentS3?.listObjects({ Prefix: albumPhotosKey, Bucket: ALBUM_BUCKET }, function(err, data) {
                if (err) {
                    return alert("There was an error viewing your album: " + err.message);
                }
                const href = "https://s3." + REGION + ".amazonaws.com/";
                const bucketUrl = href + ALBUM_BUCKET + "/";
                const photoArray = (data.Contents === undefined? [] : data.Contents);
                
                if(photoArray.length > 0){
                    const photos = photoArray.map(photo => {
                        const photoKey = photo.Key;
                        const photoUrl = bucketUrl + encodeURIComponent(photoKey===undefined? "": photoKey);
                        return {
                            album: albumName,
                            photoKey: photoKey,
                            photoUrl: photoUrl,
                            albumPhotosKey: albumPhotosKey
                        }
                    })
                    if(photos !== undefined){
                        setPhotoList(photos);
                    }
                }
            })
        }catch(e){
            alert(e)
        }
    }

    async function addPhoto(albumName: string, file: File) {
        const fileName = file.name;
        const albumPhotosKey = encodeURIComponent(albumName) + "/";
        const photoKey = albumPhotosKey + fileName;
        try{
            currentS3?.putObject({
                Bucket: ALBUM_BUCKET,
                Key: photoKey,
                Body: file,
                ACL: "public-read"
            }, function(err, data){
                if(err){
                    alert("There was an error uploading your photo: " + err.message);
                }
                alert("Successfully uploaded photo.");
            })
        }catch(e){
            alert(e);
        }
    }

    async function deletePhoto(albumName: string, photoKey: string){
        try{
            currentS3?.deleteObject({ Key: photoKey, Bucket: ALBUM_BUCKET }, function(err, data) {
                if (err) {
                    return alert("There was an error deleting your photo: " + err.message);
                }
                alert("Successfully deleted photo.");
                viewAlbum(albumName);
            });
       }catch(e){
           alert(e);
       }   
    }

    return(
        <div className="modal-content-container">
            <button className="upload-close-button" type="button" onClick={handleClick}><i className="material-icons">close</i></button>
            {isViewAlbum? 
                <ViewAlbum setViewAlbum={setViewAlbum} photoList={photoList} addPhoto={addPhoto} deletePhoto={deletePhoto}/>: 
                <ListAlbums imageFolderList={imageFolderList} createAlbum={createAlbum} deleteAlbum={deleteAlbum} viewAlbum={viewAlbum} setViewAlbum={setViewAlbum}/>
            }
        </div>
    )
}

export default UploadImageModal;