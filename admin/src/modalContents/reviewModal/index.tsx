import React, { useContext } from 'react';
import { TypeReview } from '../../utils/Type';
import { StyledFlexColumn, StyledFlexRow } from '../../utils/Styled';
import { ReviewContext } from '../../context';
import './index.css';

type ReviewModalProps = {
    setModalOpen: (isModalOpen: boolean) => void;
    review: TypeReview;
    isEditOn: boolean;
    setEditOn: (isEditOn: boolean) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({setModalOpen, review, isEditOn, setEditOn}) => {
  const {setReview} = useContext(ReviewContext);

  const handleClick = () => {
    if(isEditOn){
      setEditOn(false);
    }else{
      setEditOn(true);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // fetch update review status
  }

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReview({
      ...review,
      [name]: value
    });
  }

  return(
    <div className="modal-content-container">
      <button className="review-close-button" type="button" onClick={() => setModalOpen(false)}><i className="material-icons">close</i></button>
     
      <div className="review-image-box">image {review.images}</div>
      <StyledFlexColumn className="modal-content-wrapper">
        <div><span><i className="material-icons">rate_review</i> REVIEW ID</span><span className="review-category">{review.id}</span></div>
        <div><span><i className="material-icons">account_box</i>USER ID</span><span className="review-category">{review.userId}</span></div>
        <form onSubmit={handleSubmit}>
          <StyledFlexRow>
            <div>
              <span><i className="material-icons">visibility</i>STATUS</span>
              {isEditOn ? 
              <span><select name="status" value={review.status} onChange={onChange}>
                      <option value="visible">visible</option>
                      <option value="hidden">hidden</option>
              </select></span> : 
              <span className="review-category">{review.status}</span>
              }
            </div>
            <button className="review-edit-button" 
                    type="submit" 
                    onClick={handleClick}
                    style={{backgroundColor: isEditOn? "#2E3559":"#ffffff", color: isEditOn? "#ffffff":"#000000"}}
            >{isEditOn? "변경 상태 저장":"리뷰 상태 변경"}</button>
          </StyledFlexRow>
        </form> 
        <div><span><i className="material-icons">event</i>CREATED AT</span><span className="review-category">{review.createdAt}</span></div>
        <div><span><i className="material-icons">source</i>CONTENT</span><span className="review-category review-content">{review.content}</span></div>
      </StyledFlexColumn>
    </div>
  )
}

export default ReviewModal;