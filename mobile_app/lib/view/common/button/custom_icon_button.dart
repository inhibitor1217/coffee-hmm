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
        margin: EdgeInsets.symmetric(horizontal: 6),
        constraints: BoxConstraints(maxHeight: 44, maxWidth: 44),
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
              content.icon,
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
  final Icon icon;

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
