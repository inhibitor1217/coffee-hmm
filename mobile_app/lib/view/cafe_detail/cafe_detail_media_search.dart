import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/util/common.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_list_item.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_section_title.dart';

class CafeDetailMediaSearch extends StatelessWidget {
  final String cafeName;

  CafeDetailMediaSearch({required this.cafeName});

  @override
  Widget build(BuildContext context){
    return Container(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 56),
          CafeDetailSectionTitle(title: '통합 검색', showBadge: false),
          CafeDetailListItem(
            title: '네이버 통합 검색 바로가기',
            icon: Icons.manage_search_rounded,
            subIcon: Icons.launch_rounded,
            color: Palette.lightGreen,
            onPressed: () => handleNaverClick(cafeName, context),
          ),
          CafeDetailListItem(
            title: '인스타그램 태그 검색 바로가기',
            icon: Icons.photo,
            subIcon: Icons.launch_rounded,
            color: Palette.lightPurple,
            onPressed: () => handleInstagramClick(cafeName, context),
          )
        ],
      )
    );
  }
}