import 'package:flutter/material.dart';
import 'package:mobile_app/cafe_info.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/constants/util.dart';

class CafeMainInfo extends StatelessWidget {
  final CafeModel cafe;

  CafeMainInfo({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.only(left: 20, right: 20, bottom: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CafeName(name: cafe.name),
            SizedBox(height: 4),
            Text(
              '${cafe.place.name} OPEN ${cafe.metadata?.hour ?? ''}',
              style: TextStyle(fontSize: 14),
            ),
            SizedBox(
              height: 4,
            ),
            Container(
              alignment: Alignment.centerRight,
              child: Text(
                "${cafe.metadata?.creator ?? 'jyuunnii'} 님이 올려주신 ${cafe.name}",
                style: TextStyle(
                  fontSize: 11,
                ),
              ),
            )
          ],
        ));
  }
}

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
            CafeName(name: cafe.name),
            SizedBox(height: 8),
            _buildCafeDetailInfo(context),
          ],
        ));
  }

  Widget _buildCafeDetailInfo(BuildContext context) {
    final data = getCafeDetailInfo(cafe);

    return Column(
      children: [
        if (hasCafeMetadata(data.hour))
          CafeDetailInfoItem(
            text: data.hour,
            icon: Icons.access_time_rounded,
          ),
        if (hasCafeMetadata(data.address))
          CafeDetailInfoItem(
            text: data.address,
            icon: Icons.place_rounded,
          ),
        if (hasCafeMetadata(data.line) && hasCafeMetadata(data.station))
          CafeDetailSubwayLineItem(station: data.station, line: data.line),
        if (hasCafeMetadata(data.call))
          CafeDetailInfoItem(
            text: data.call,
            icon: Icons.call,
          ),
        CafeDetailInfoItem(
          text: '네이버 통합검색 바로가기',
          icon: Icons.search_rounded,
          subIcon: Icons.launch_rounded,
          onPressed: () =>
              handleNaverClick(cafe.name + ' ' + cafe.place.name, context),
        ),
        CafeDetailInfoItem(
          text: '인스타그램 태그검색 바로가기',
          icon: Icons.search_rounded,
          subIcon: Icons.launch_rounded,
          onPressed: () => handleInstagramClick(cafe.name, context),
        )
      ],
    );
  }
}

class CafeName extends StatelessWidget {
  final String name;

  CafeName({required this.name});

  @override
  Widget build(BuildContext context) {
    return Text(
      name,
      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
    );
  }
}
