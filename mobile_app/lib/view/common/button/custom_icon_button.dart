import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/view/common/button/button_size.dart';

class CustomIconButton extends StatelessWidget {
  final ButtonSize size;
  final IconButtonContent content;
  final Function() onPressed;

  CustomIconButton({required this.size, required this.content, required this.onPressed});

  @override
  Widget build(BuildContext context){
    return  Container(
      height: size.height,
      padding: size.padding,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: Colors.white,
          shadowColor: Colors.transparent,
          splashFactory: null,
        ),
          child: Column(
            children: [
              Icon(content.icon, size: 24, color: Palette.highlightedColor),
              Text(content.text, style: TextStyle(color: Palette.darkGray, fontSize: 12))
            ],
          ),
        onPressed: onPressed,
      ),
    );
  }
}
class IconButtonContent {
  final String text;
  final IconData icon;

  IconButtonContent({required this.text, required this.icon});
}