import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/cafe_detail.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_info_time_item.dart';
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
    final _data = getCafeDetailInfo(cafe);
    final _hasMetadata = hasCafeMetadata(_data.hour)
    || (hasCafeMetadata(_data.line) && hasCafeMetadata(_data.station))
    || hasCafeMetadata(_data.call)
    || hasCafeMetadata(_data.address);

    return Column(
      children: [
        if (hasCafeMetadata(_data.hour))
          CafeDetailInfoTimeItem(displayTime: _data.hour, hours: cafe.metadata!.hours!),
        if (hasCafeMetadata(_data.line) && hasCafeMetadata(_data.station))
          CafeDetailSubwayLineItem(station: _data.station, line: _data.line),
        if (hasCafeMetadata(_data.call))
          CafeInfoItem(
            text: _data.call,
            fontSize: 14,
            icon: Icons.call,
            margin: EdgeInsets.only(bottom: 18),
          ),
        if (hasCafeMetadata(_data.address))
          CafeInfoItem(
            text: _data.address,
            fontSize: 14,
            icon: Icons.place_rounded,
          ),
        if(!_hasMetadata)
          Text('곧 업데이트 됩니다 !')
      ],
    );
  }
}
