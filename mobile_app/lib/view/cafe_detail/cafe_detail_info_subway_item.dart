import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/view/cafe_detail/subway_line_badge.dart';
import 'package:mobile_app/view/common/badge.dart';
import 'package:mobile_app/view/common/text_info.dart';

class CafeDetailSubwayLineItem extends StatelessWidget {
  final String station;
  final List<String> line;

  CafeDetailSubwayLineItem({required this.station, required this.line});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(Icons.directions_subway, size: 15, color: Palette.highlightedColor),
          SizedBox(width: 6),
          _buildSubwayBadges(line, context),
          SizedBox(width: 6),
          TextInfo(
            text: '$station역',
            fontSize: 13,
          ),
        ],
      ),
    );
  }

  Widget _buildSubwayBadges(List<String> line, BuildContext context) {
    return Container(
        height: 15,
        margin: EdgeInsets.only(bottom: 1),
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          shrinkWrap: true,
          itemCount: line.length,
          itemBuilder: (context, index) {
            return  Container(
              margin: EdgeInsets.only(right: index == line.length - 1 ? 0 : 2),
              child: SubwayLineBadge(line: line[index]),
            );
          },
        ));
  }
}


