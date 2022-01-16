import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';

import 'text_info.dart';

class CafeInfoItem extends StatelessWidget {
  final String text;
  final IconData icon;
  final IconData? subIcon;
  final Function()? onPressed;
  final EdgeInsetsGeometry? margin;
  final double? fontSize;

  CafeInfoItem({
    required this.text,
    required this.icon,
    this.subIcon,
    this.onPressed,
    this.margin,
    this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    final _iconSize = (fontSize ?? 13) + 2;
    return Container(
        margin: margin,
        child: Row(
          children: [
            Icon(
              icon,
              size: _iconSize,
              color: Palette.highlightedColor,
            ),
            SizedBox(width: 6),
            TextInfo(text: text, fontSize: fontSize, onPressed: onPressed),
            if (subIcon != null)
              Row(
                children: [SizedBox(width: 4), Icon(subIcon, size: _iconSize)],
              )
          ],
        ));
  }
}
