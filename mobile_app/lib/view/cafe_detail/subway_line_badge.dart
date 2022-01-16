import 'package:flutter/material.dart';

class SubwayLineBadge extends StatelessWidget {
  final String line;

  SubwayLineBadge({required this.line});

  @override
  Widget build(BuildContext context){
    return Container(
      child: Center(
          child: Text(
            line,
            style: TextStyle(fontSize: 8, color: Colors.white, fontWeight: FontWeight.bold),
          )),
      constraints: BoxConstraints(minHeight: 15, minWidth: 15),
      padding: EdgeInsets.symmetric(horizontal: 4),
      decoration: BoxDecoration(
          color: getSubwayColor(line),
          borderRadius: BorderRadius.all(Radius.circular(10))
      ),
    );
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