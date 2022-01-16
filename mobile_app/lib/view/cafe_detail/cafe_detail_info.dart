import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/cafe_detail.dart';
import 'package:mobile_app/util/common.dart';
import 'package:mobile_app/view/common/cafe_info_item.dart';
import 'package:mobile_app/view/common/cafe_name.dart';

import 'cafe_detail_info_subway_item.dart';

class CafeDetailInfo extends StatelessWidget {
  final CafeModel cafe;

  CafeDetailInfo({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Container(
        alignment: Alignment.centerLeft,
        padding: EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CafeName(name: cafe.name, customStyle: CafeNameStyles.detailStyle,),
            SizedBox(height: 16),
            _buildCafeDetailInfo(context),
          ],
        ));
  }

  Widget _buildCafeDetailInfo(BuildContext context) {
    final data = getCafeDetailInfo(cafe);

    return Column(
      children: [
        if (hasCafeMetadata(data.hour))
          CafeInfoItem(
            text: data.hour,
            fontSize: 14,
            icon: Icons.access_time_rounded,
            margin: EdgeInsets.only(bottom: 18),
          ),
        if (hasCafeMetadata(data.address))
          CafeInfoItem(
            text: data.address,
            fontSize: 14,
            icon: Icons.place_rounded,
            margin: EdgeInsets.only(bottom: 18),
          ),
        if (hasCafeMetadata(data.line) && hasCafeMetadata(data.station))
          CafeDetailSubwayLineItem(station: data.station, line: data.line),
        if (hasCafeMetadata(data.call))
          CafeInfoItem(
            text: data.call,
            fontSize: 14,
            icon: Icons.call,
            margin: EdgeInsets.only(bottom: 18),
          ),
        CafeInfoItem(
          text: '네이버 통합검색 바로가기',
          icon: Icons.search_rounded,
          fontSize: 14,
          subIcon: Icons.launch_rounded,
          onPressed: () =>
              handleNaverClick(cafe.name + ' ' + cafe.place.name, context),
          margin: EdgeInsets.only(bottom: 18),
        ),
        CafeInfoItem(
          text: '인스타그램 태그검색 바로가기',
          fontSize: 14,
          icon: Icons.search_rounded,
          subIcon: Icons.launch_rounded,
          onPressed: () => handleInstagramClick(cafe.name, context),
        )
      ],
    );
  }
}
