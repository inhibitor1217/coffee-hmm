import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/view/common/button/button_size.dart';

class CustomButton extends StatelessWidget {
  final ButtonSize size;
  final Widget child;
  final Function() onPressed;

  CustomButton({required this.size, required this.child, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: size.height,
      padding: size.padding,
      child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            primary: Palette.highlightedColor,
            onPrimary: Colors.white,
            shadowColor: Colors.transparent,
            splashFactory: null,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          child: child,
          onPressed: onPressed),
    );
  }
}

