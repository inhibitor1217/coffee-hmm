import React from "react";
import "./index.css";
import MenuSubCategory from "../MenuSubCategory";

export type Menus = {
  categories: MenuCategory[];
};

export type MenuCategory = {
  categoryName: string;
  categoryMenu: MenuPrice[];
};

export type MenuPrice = {
  name: string;
  ename: string;
  price: string;
};

type MenuCategoryProps = {
  menus: Menus;
};

const MenuCategory = ({ menus }: MenuCategoryProps) => {
  let totalWidth = calWidth({ menus });
  let menuWidth = totalWidth * 180;

  return (
    <div
      style={{
        width: menuWidth,
        height: "140px",
      }}
    >
      <ul className="category-wrapper">
        {menus.categories.map((category, index) => {
          let categoryWidth = Math.floor(category.categoryMenu.length / 5) + 1;

          return (
            <div key={index}>
              <div className="categoryname">{category.categoryName}</div>
              <li
                className="category"
                key={index}
                style={{
                  width: categoryWidth * 160,
                  height: "120px",
                }}
              >
                {addMenuSection(category, categoryWidth)}
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

const calWidth = ({ menus }: MenuCategoryProps) => {
  let totalWidth = 0;
  menus.categories.forEach((category) => {
    const len = Math.floor(category.categoryMenu.length / 5) + 1;
    if (len < 1) {
      totalWidth += 1;
    } else {
      totalWidth += len;
    }
  });
  return totalWidth;
};

const addMenuSection = (c: MenuCategory, w: number) => {
  let menuArray = [];
  for (let index = 0; index < w; index++) {
    menuArray.push(
      <MenuSubCategory
        categoryMenu={c.categoryMenu}
        index={index}
        key={index}
      />
    );
  }
  return menuArray;
};

export default MenuCategory;
