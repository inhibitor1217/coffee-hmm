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
      alignment: Alignment.topCenter,
      height: size.height,
      padding: size.padding,
      child: Container(
        margin: EdgeInsets.symmetric(horizontal: 10),
        constraints: BoxConstraints(maxHeight: 40, maxWidth: 40),
        child: ElevatedButton(
          style: ButtonStyle(
            padding: MaterialStateProperty.all(EdgeInsets.all(0)),
            backgroundColor: MaterialStateProperty.all(Colors.white),
            overlayColor: MaterialStateProperty.resolveWith(_getColor),
            elevation: MaterialStateProperty.all(0),
            shape: MaterialStateProperty.all(RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            )),
          ),
          child: Column(
            children: [
              Icon(content.icon, size: 20, color: Palette.highlightedColor),
              Text(content.text, style: TextStyle(color: Palette.darkGray, fontSize: 12))
            ],
          ),
          onPressed: onPressed,
        ),
      ),
    );
  }
}
class IconButtonContent {
  final String text;
  final IconData icon;

  IconButtonContent({required this.text, required this.icon});
}

Color _getColor(Set<MaterialState> states) {
  const Set<MaterialState> _interactiveStates = <MaterialState>{
    MaterialState.pressed,
    MaterialState.hovered,
    MaterialState.focused,
  };
  if (states.any(_interactiveStates.contains)) {
    return Palette.lightBlue30;
  }
  return Colors.white;
}
