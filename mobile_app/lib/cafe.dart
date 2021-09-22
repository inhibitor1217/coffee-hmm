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
            buildCafeName(cafe.name),
            SizedBox(height: 4),
            Text(
              '${cafe.place.name} OPEN ${cafe.metadata!.hour}',
              style: TextStyle(fontSize: 14),
            ),
            SizedBox(
              height: 4,
            ),
            Container(
              alignment: Alignment.centerRight,
              child: Text(
                "${cafe.metadata!.creator ?? 'jyuunnii'} 님이 올려주신 ${cafe.name}",
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
            buildCafeName(cafe.name),
            SizedBox(height: 8),
            _buildCafeDetailInfo(context),
          ],
        ));
  }

  Widget _buildCafeDetailInfo(BuildContext context) {
    final hoursData = getCafeMetadataHours(cafe.metadata!.hours) ?? '';
    final addressData =
        getCafeMetadataPlainText(cafe.metadata!.location!.address) ?? '';
    final lineData =
        getCafeMetadataPlainText(cafe.metadata!.location!.subway!.line) ?? [];
    final stationData =
        getCafeMetadataPlainText(cafe.metadata!.location!.subway!.station) ??
            '';
    final callData = getCafeMetadataPlainText(cafe.metadata!.call) ?? '';

    return Column(
      children: [
        if (hasCafeMetadata(hoursData))
          CafeDetailInfoItem(
            text: hoursData,
            icon: Icons.access_time_rounded,
          ),
        if (hasCafeMetadata(addressData))
          CafeDetailInfoItem(
            text: addressData,
            icon: Icons.place_rounded,
          ),
        if (hasCafeMetadata(lineData) && hasCafeMetadata(stationData))
          CafeDetailSubwayLineItem(station: stationData, line: lineData),
        if (hasCafeMetadata(callData))
          CafeDetailInfoItem(
            text: callData,
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

Widget buildCafeName(String cafeName) {
  return Text(
    cafeName,
    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
  );
}
