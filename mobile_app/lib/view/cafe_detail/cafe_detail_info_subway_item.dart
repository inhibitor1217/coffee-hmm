import 'package:flutter/material.dart';

import 'cafe_detail_info_item.dart';

class CafeDetailSubwayLineItem extends StatelessWidget {
  final String station;
  final List<String> line;

  CafeDetailSubwayLineItem({required this.station, required this.line});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          _buildSubwayTag(line, context),
          SizedBox(width: 6),
          TextInfo(text: '$station역'),
        ],
      ),
    );
  }

  Widget _buildSubwayTag(List<String> line, BuildContext context) {
    return Container(
        height: 14,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          shrinkWrap: true,
          itemCount: line.length,
          itemBuilder: (context, index) {
            return Container(
              child: Center(
                  child: Text(
                line[index],
                style: TextStyle(fontSize: 8, color: Colors.white),
              )),
              padding: EdgeInsets.symmetric(horizontal: 4),
              margin: EdgeInsets.only(right: index == line.length - 1 ? 0 : 2),
              decoration: BoxDecoration(
                  color: getSubwayColor(line[index]),
                  borderRadius: BorderRadius.all(Radius.circular(10))),
            );
          },
        ));
  }
}

Color getSubwayColor(String line) {
  switch (line) {
    case '1':
      return Color.fromRGBO(44, 49, 136, 1);
    case '2':
      return Color.fromRGBO(0, 162, 89, 1);
    case '3':
      return Color.fromRGBO(242, 92, 5, 1);
    case '4':
      return Color.fromRGBO(45, 162, 206, 1);
    case '5':
      return Color.fromRGBO(135, 59, 217, 1);
    case '6':
      return Color.fromRGBO(187, 81, 7, 1);
    case '7':
      return Color.fromRGBO(111, 123, 21, 1);
    case '8':
      return Color.fromRGBO(201, 46, 170, 1);
    case '9':
      return Color.fromRGBO(187, 162, 15, 1);
    case '수인분당':
      return Color.fromRGBO(232, 180, 13, 1);
    case '경의중앙':
      return Color.fromRGBO(80, 185, 184, 1);
    case '경강':
      return Color.fromRGBO(83, 187, 200, 1);
    case '신분당':
      return Color.fromRGBO(248, 8, 8, 1);
    default:
      return Colors.black;
  }
}
