import React from "react";
import { MenuPrice } from "../MenuCategory";
import "./index.css";
type MenuSubCategoryProps = {
  categoryMenu: MenuPrice[];
  index: number;
};

const MenuSubCategory = ({ categoryMenu, index }: MenuSubCategoryProps) => {
  let newArr = categoryMenu.slice(index * 5, index * 5 + 5);

  return (
    <div className="subcategory">
      {newArr.map((menu, index) => {
        return (
          <div className="subcategory-one" key={index}>
            <div className="menu-name">{menu.name} </div>
            <div className="menu-price">
              {" "}
              {Number.parseInt(menu.price) / 1000}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuSubCategory;
