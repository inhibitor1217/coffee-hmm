import React from 'react';
import { Link } from 'react-router-dom';
import { TypeCafe } from '../../../utils/Type';
import './index.css';

type CafeSearchResultTableProps = {
    cafe: TypeCafe;
}

const CafeSearchResultTableRow = ({cafe}: CafeSearchResultTableProps) => {
    return(
        <ul className="cafe-row-wrapper">
            <li><Link to={`/cafe/${cafe.id}`}>{cafe.name}</Link></li>
            <li>{cafe.place.name}</li>
            <li>{cafe.metadata?.hour}</li>
            <li>{cafe.state}</li>
            <li>{cafe.createdAt}</li>
            <li>{cafe.image.count}</li>
            {/* <li>{cafe.reviews}</li> */}
        </ul>
    )
}

export default CafeSearchResultTableRow;