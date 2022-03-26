import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/cafe_detail.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_info_time_item.dart';
import 'package:mobile_app/view/common/cafe_info_item.dart';
import 'package:mobile_app/view/common/cafe_name.dart';

import 'cafe_detail_info_subway_item.dart';

class CafeDetailInfo extends StatefulWidget {
  final CafeModel cafe;
  final bool isSaved;
  final Function() onSaveCafe;

  CafeDetailInfo({required this.cafe, required this.isSaved, required this.onSaveCafe});

  @override
  _CafeDetailInfoState createState() => _CafeDetailInfoState();
}

class _CafeDetailInfoState extends State<CafeDetailInfo> {
  @override
  Widget build(BuildContext context) {
    return Container(
        alignment: Alignment.centerLeft,
        padding: EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildCafeDetailHeader(),
            SizedBox(height: 16),
            _buildCafeDetailInfo(),
          ],
        ));
  }

  Widget _buildCafeDetailHeader(){
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        CafeName(name: widget.cafe.name, customStyle: CafeNameStyles.detailStyle,),
        IconButton(
          alignment: Alignment.centerRight,
          icon: Icon(widget.isSaved ? Icons.bookmark : Icons.bookmark_border_rounded),
          color: widget.isSaved ? Palette.highlightedColor : Palette.gray,
          iconSize: 28,
          onPressed: widget.onSaveCafe,
        ),
      ],
    );
  }

  Widget _buildCafeDetailInfo() {
    final _data = getCafeDetailInfo(widget.cafe);
    final _hasMetadata = hasCafeMetadata(_data.hour)
    || (hasCafeMetadata(_data.line) && hasCafeMetadata(_data.station))
    || hasCafeMetadata(_data.call)
    || hasCafeMetadata(_data.address);

    return Column(
      children: [
        if (hasCafeMetadata(_data.hour))
          CafeDetailInfoTimeItem(displayTime: _data.hour, hours: widget.cafe.metadata!.hours!),
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
