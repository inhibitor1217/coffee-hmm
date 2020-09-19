import React from "react";
import "./index.css";
import MenuSubCategory, { menusPerSubcategory } from "../MenuSubCategory";
import MenuCarousel from "../MenuCarousel";
import { Menus, MenuCategory } from "../../../utils";

type CafeMenuProps = {
  menus: Menus | undefined;
};

const fixedSubcategoryAreaWidth = 160;
const fixedSubcategoryAreaHeight = 120;
const fixedMenuAreaHeight = 140;

const CafeMenu = ({ menus }: CafeMenuProps) => {
  let totalSubcategoryNum = getTotalSubcategoryNum({ menus });
  let neededMenuWidth = totalSubcategoryNum * fixedSubcategoryAreaWidth;

  return (
    <div
      style={{
        width: neededMenuWidth,
        height: fixedMenuAreaHeight,
      }}
    >
      <ul className="category-wrapper">
        <MenuCarousel totalSubCategory={totalSubcategoryNum}>
          {menus?.categories?.map((category, index) => {
            const subPerCategory = getSubPerCategory(category);

            return (
              <div key={index}>
                <div className="categoryname">{category.categoryName}</div>
                <li
                  className="category-one"
                  key={index}
                  style={{
                    width: subPerCategory * fixedSubcategoryAreaWidth,
                    height: fixedSubcategoryAreaHeight,
                  }}
                >
                  {OneCategoryArea(category, subPerCategory)}
                </li>
              </div>
            );
          })}
        </MenuCarousel>
      </ul>
    </div>
  );
};

const getSubPerCategory = (category: MenuCategory) => {
  const menusPerCategory = category.categoryMenu.length;

  const subsPerCategory = Math.floor(menusPerCategory / menusPerSubcategory);

  if (subsPerCategory < 1) {
    return 1;
  } else {
    return subsPerCategory;
  }
};

const getTotalSubcategoryNum = ({ menus }: CafeMenuProps) => {
  const totalSubcategoryNum =
    menus?.categories?.reduce<number>(
      (acc, cur) => acc + getSubPerCategory(cur),
      0
    ) || 0;

  return totalSubcategoryNum;
};

const OneCategoryArea = (category: MenuCategory, subcategoryNum: number) => {
  let totalMenusPerCategory = [];
  for (let index = 0; index < subcategoryNum; index++) {
    totalMenusPerCategory.push(
      <MenuSubCategory
        categoryMenu={category.categoryMenu}
        index={index}
        key={index}
      />
    );
  }
  return totalMenusPerCategory;
};

export default CafeMenu;
