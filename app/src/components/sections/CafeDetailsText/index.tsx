import React from "react";
import "./index.css";
import MenuCategory from "../MenuCategory";
import { CafeInfo } from "../MainFeed";
import CafeBasicInfo from "../CafeBasicInfo";
import styled from "styled-components";

const InfoContainer = styled.div`
  width: 300px;
  height: 40px;
  padding-bottom: 10px;
`;

const MenuContainer = styled.div`
  width: 300px;
  height: 200px;
  margin-bottom: 10px;
  overflow: hidden;
`;

type CafeDetailsProps = {
  cafe: CafeInfo | null;
};

let menus = {
  categories: [
    {
      categoryName: "ESPRESSO",
      categoryMenu: [
        { name: "아메리카노", ename: "Americano", price: "3500" },
        { name: "플랫화이트", ename: "Flat White", price: "4000" },
        { name: "카페라떼", ename: "Cafe Latte", price: "4500" },
        { name: "카푸치노", ename: "Cappucion", price: "4500" },
        { name: "바닐라 라떼", ename: "Vanilla Latte", price: "5000" },
        { name: "카라멜 라떼", ename: "Caramel Latte", price: "5000" },
        { name: "카카오 카페모카", ename: "Cacao Mocha", price: "5500" },
        { name: "콜드브루", ename: "Cold Brew", price: "4500" },
        { name: "솔티드 아인슈페너", ename: "Einspanner", price: "5800" },
        { name: "아포가토", ename: "Affogato", price: "5800" },
        { name: "아포라떼", ename: "Affolatte", price: "6800" },
        {
          name: "디카페인 브루잉커피",
          ename: "Decaffein Brewing",
          price: "4500",
        },
      ],
    },
    {
      categoryName: "MILK TEA",
      categoryMenu: [
        { name: "유기농 밀크티", ename: "Milk Tea", price: "4500" },
        { name: "진저 밀크티", ename: "Ginger Milk Tea", price: "5000" },
        { name: "차차 라떼", ename: "Cha Cha Latte", price: "5800" },
      ],
    },
    {
      categoryName: "FRUIT MILK",
      categoryMenu: [
        { name: "바나나 우유", ename: "Banana Tea", price: "4500" },
        { name: "딸기 우유", ename: "Strawberry Tea", price: "5300" },
        { name: "멜론 우유", ename: "Melon Milk", price: "5500" },
        { name: "블랙베리 우유", ename: "Blueberry Milk", price: "5500" },
      ],
    },
    {
      categoryName: "FRUIT TEA",
      categoryMenu: [
        { name: "유자 진저티", ename: "Yuja Ginger Tea", price: "5000" },
        { name: "허니 진저 애플티", ename: "Honey Ginger Tea", price: "5500" },
        { name: "망고 아이스티", ename: "Mango Ice Tea", price: "5500" },
        { name: "자몽 스쿼시", ename: "Grapefruit Squash", price: "5000" },
        { name: "라임 모히토", ename: "Lime Mojito", price: "5500" },
        { name: "샹그리아", ename: "Sangria", price: "6000" },
        { name: "글리바윈", ename: "Gluhwein", price: "6000" },
      ],
    },
    {
      categoryName: "SIGNITURE",
      categoryMenu: [
        { name: "멜팅라떼", ename: "Melting Latte", price: "5500" },
        {
          name: "썬셋오렌지 라떼",
          ename: "Sunset Orange Latte",
          price: "5500",
        },
        { name: "흑당라떼", ename: "Black Sugar Latte", price: "5500" },
        { name: "플랫화이트 크림", ename: "Flat White Cream", price: "4500" },
      ],
    },
    {
      categoryName: "DECAFFEIN HERB TEA",
      categoryMenu: [
        {
          name: "루이보스 블루베리 티",
          ename: "Rooibos Bluberry Tea",
          price: "5000",
        },
        { name: "마테 레몬그라스 티", ename: "Lemongrass Tea", price: "5000" },
      ],
    },
    {
      categoryName: "GREEN BLACK TEA",
      categoryMenu: [
        { name: "보성녹차(우전)", ename: "Greeb Tea", price: "5000" },
        { name: "로즈 그린티", ename: "Rose Green Melange Tea", price: "5300" },
        { name: "바닐라 블랙티", ename: "Vanilla Black Tea", price: "5000" },
        { name: "얼그레이 티", ename: "Earl Grey Tea", price: "5000" },
      ],
    },
  ],
};

const CafeDetailsText = ({ cafe }: CafeDetailsProps) => {
  return (
    <div>
      <InfoContainer>
        <CafeBasicInfo cafe={cafe} />
      </InfoContainer>
      <MenuContainer className="menu-container">
        <h4 className="menu-header">Cafe Menu</h4>
        <MenuCategory menus={menus} />
      </MenuContainer>
    </div>
  );
};

export default CafeDetailsText;
