import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';

class Error extends StatelessWidget {
  final String? title;

  Error({this.title});

  @override
  Widget build(BuildContext context) {
    return Center(
        child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.error_rounded, color: Palette.lightGray, size: 48),
        SizedBox(height: 8),
        Text(title ?? '페이지 오류입니다.',
            style: TextStyle(color: Palette.gray, fontSize: 14)),
        SizedBox(height: 16),
        ElevatedButton(
          child: Text('돌아가기'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ],
    ));
  }
}
