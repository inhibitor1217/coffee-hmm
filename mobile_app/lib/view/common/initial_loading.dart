import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:mobile_app/constants/color.dart';

class InitialLoading extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          SizedBox(height: 170),
          SvgPicture.asset(
            'assets/images/loading_text.svg',
            width: 130,
            height: 68,
          ),
          SizedBox(height: 20),
          SizedBox(
            width: 14,
            height: 14,
            child: CircularProgressIndicator(
              semanticsLabel: 'Linear progress indicator',
              strokeWidth: 4,
              color: Palette.highlightedColor,
            ),
          ),
        ],
      ),
    );
  }
}