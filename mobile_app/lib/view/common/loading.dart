import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';

class LoadingSpinner extends StatelessWidget {
  final double? width;
  final double? height;

  LoadingSpinner({this.width, this.height});

  @override
  Widget build(BuildContext context) {
    return Container(
        width: width,
        height: height,
        child:
            Center(child: CircularProgressIndicator(color: Palette.lightGray)));
  }
}
