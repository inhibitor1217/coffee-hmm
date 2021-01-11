import React from 'react';
import { Cafe } from '../../../utils/Type';
import './index.css';

type CafeSearchResultTableProps = {
    cafe: Cafe;
}

const CafeSearchResultTableRow = ({cafe}: CafeSearchResultTableProps) => {
    return(
        <ul className="cafe-row-wrapper">
            <li>{cafe.name}</li>
            <li>{cafe.place}</li>
            <li>{cafe.openHour}~{cafe.closeHour}</li>
            <li>{cafe.status}</li>
            <li>{cafe.createdAt}</li>
            <li>{cafe.images}</li>
            <li>{cafe.reviews}</li>
        </ul>
    )
}

export default CafeSearchResultTableRow;