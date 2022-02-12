import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/enum.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_section_title.dart';

class CafeDetailMenus extends StatelessWidget {
  final List<CafeMetaMenuModel> menus;

  CafeDetailMenus({required this.menus});

  @override
  Widget build(BuildContext context){
    return Container(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 56),
          CafeDetailSectionTitle(title: '시그니쳐 메뉴', showBadge: true),
          ...menus.map((menu) => CafeDetailMenu(menu: menu)).toList()
        ],
      )
    );
  }
}

class CafeDetailMenu extends StatelessWidget {
  final CafeMetaMenuModel menu;

  CafeDetailMenu({required this.menu});

  @override
  Widget build(BuildContext context){
    return Container(
      margin: EdgeInsets.only(bottom: 20, left: 20),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
                color: Palette.lightBlue,
                borderRadius: BorderRadius.all(Radius.circular(18))
            ),
            child: Icon(GetIcon.name(menu.category!), size: 28, color: Colors.white),
          ),
          SizedBox(width: 12),
          Text(menu.name ?? '',
              style: TextStyle(
              color: Palette.darkGray,
              fontSize: 14,
              fontWeight: FontWeight.bold
            ))
        ],
      )
    );
  }
}

extension GetIcon on CafeMenuCategory {
  static IconData name(CafeMenuCategory category) {
    switch(category){
      case CafeMenuCategory.coffee:
        return Icons.coffee_rounded;
      case CafeMenuCategory.nonCoffee:
        return Icons.local_drink_rounded;
      case CafeMenuCategory.dessert:
        return Icons.cake_rounded;
    }
  }
}