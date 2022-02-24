import 'package:flutter/material.dart';
import 'package:mobile_app/constants/enum.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_list_item.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_section_title.dart';

class CafeDetailMenus extends StatelessWidget {
  final List<CafeMetaMenuModel> menus;
  Iterable<CafeMetaMenuModel> get validMenus => menus.where((menu) => _hasMenu(menu));

  CafeDetailMenus({required this.menus});

  bool _hasMenu(CafeMetaMenuModel menu){
    return menu.name != null && menu.category != null;
  }

  @override
  Widget build(BuildContext context){
    return Container(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 56),
          CafeDetailSectionTitle(title: '시그니쳐 메뉴', showBadge: true),
          ...validMenus.map((menu) =>
              CafeDetailListItem(
                  title: menu.name ?? '',
                  icon: GetIcon.name(menu.category!),
              )
          )
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