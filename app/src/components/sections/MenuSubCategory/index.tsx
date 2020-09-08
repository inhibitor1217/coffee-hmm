import React from "react";
import { MenuPrice } from "../MenuCategory";
import "./index.css";

type MenuSubCategoryProps = {
  categoryMenu: MenuPrice[];
  index: number;
};

export const menusPerSubcategory = 6;

const MenuSubCategory = ({ categoryMenu, index }: MenuSubCategoryProps) => {
  let dividedMenuArray = categoryMenu.slice(
    index * menusPerSubcategory,
    index * menusPerSubcategory + menusPerSubcategory
  );

  return (
    <div className="subcategory">
      {dividedMenuArray.map((menu, index) => {
        return (
          <div className="subcategory-one" key={index}>
            <div className="menu-name">{menu.name} </div>
            <div className="menu-price">
              {Number.parseInt(menu.price) / 1000}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuSubCategory;
