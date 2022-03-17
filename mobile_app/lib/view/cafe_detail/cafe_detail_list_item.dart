import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';

class CafeDetailListItem extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final IconData? subIcon;
  final Function()? onPressed;

  CafeDetailListItem({
    required this.title,
    required this.icon,
    this.color = Palette.lightBlue,
    this.subIcon,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context){
    return ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: Colors.transparent,
          shadowColor: Colors.transparent,
          padding: EdgeInsets.all(0),
          elevation: 0,
        ),
        onPressed: onPressed,
        child: Container(
            padding: EdgeInsets.only(bottom: 20, left: 20),
            color: Colors.white,
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                      color: color,
                      borderRadius: BorderRadius.all(Radius.circular(18))
                  ),
                  child: Icon(icon, size: 28, color: Colors.white),
                ),
                SizedBox(width: 12),
                Text(title,
                    style: TextStyle(
                        color: Palette.darkGray,
                        fontSize: 14,
                        fontWeight: FontWeight.bold
                    )
                ),
                if (subIcon != null)
                  Row(
                    children: [SizedBox(width: 6), Icon(subIcon, size: 14, color: Colors.black)],
                  )
              ],
            )
        ),
    );
  }
}