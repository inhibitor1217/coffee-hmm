import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../../../context';
import { TypeImage } from '../../../utils/Type';
import CafeDetailImageTable from '../CafeDetailImageTable';
import CafeImageButtons from '../CafeImageButtons';
import CafeTablePagination from '../CafeTablePagination';
import './index.css';

type CafeImageBoardProps = {
    name: string;
    images: TypeImage[];
    imageLoading: boolean;
    isCheckedAll: boolean;
    setCheckedAll: (isCheckedAll: boolean) => void;
    setUploadImage: (isUploadImage: boolean) => void;
}

const CafeImageBoard = ({name, images, imageLoading, isCheckedAll, setCheckedAll, setUploadImage}: CafeImageBoardProps) => {
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const rowsOnCurrentPage = images.slice(indexOfFirstRow, indexOfLastRow);
    const endingPage = images.length / rowsPerPage;
    const [isChangeInsert, setChangeInsert] = useState<boolean>(false);
    const {setModalOpen} = useContext(ModalContext);
    
    useEffect(() => {
        if(deletedImages.length === 10 || deletedImages.length === images.length){
            setCheckedAll(true);
        }else if(deletedImages.length === 0){
            setCheckedAll(false);
        }
    }, [deletedImages, images, setCheckedAll])


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(isChangeInsert){
            if(deletedImages.length > 1){
                window.alert("대표 사진으로 1장만 선택해주세요.")
            }else{
                //fetch change main image
            }
            setChangeInsert(false);          
        }else{
            //fetch delete selected image
        }
    }



    return(
        <div className="board-container">
            <div className="title-button-container">
                <div>
                    <h3>카페 <span>({images.length})</span></h3>
                    <h5>{name}에 등록된 리뷰입니다.</h5>
                </div>
            </div>
            <div className="table-container"><CafeTablePagination currentPage={currentPage} setCurrentPage={setCurrentPage} endingPage={endingPage}/></div>
        
            <form onSubmit={handleSubmit}>
                <CafeImageButtons setChangeInsert={setChangeInsert} setModalOpen={setModalOpen} setUploadImage={setUploadImage}/>
                <CafeDetailImageTable images={rowsOnCurrentPage} imageLoading={imageLoading} isPreview={false} 
                                        deletedImages={deletedImages} setDeletedImages={setDeletedImages}
                                        isCheckedAll={isCheckedAll} setCheckedAll={setCheckedAll}/>
            </form>
        </div>
    )
}

export default CafeImageBoard;