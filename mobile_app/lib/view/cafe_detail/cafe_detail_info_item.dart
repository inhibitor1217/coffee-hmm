import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';

class CafeDetailInfoItem extends StatelessWidget {
  final String text;
  final IconData icon;
  final IconData? subIcon;
  final Function()? onPressed;

  CafeDetailInfoItem(
      {required this.text, required this.icon, this.subIcon, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(
            icon,
            size: 14.0,
            color: Palette.gray,
          ),
          SizedBox(width: 6),
          TextInfo(text: text, onPressed: onPressed),
          if (subIcon != null)
            Row(
              children: [SizedBox(width: 4), Icon(subIcon, size: 14.0)],
            )
        ],
      ),
    );
  }
}

class TextInfo extends StatelessWidget {
  final String text;
  final Function()? onPressed;

  TextInfo({required this.text, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: Text(text,
          style: TextStyle(
            color: Colors.black,
            fontSize: 12,
            height: 1.2,
          )),
      onTap: onPressed,
    );
  }
}
