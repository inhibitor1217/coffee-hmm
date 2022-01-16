import 'package:flutter/material.dart';

enum BadgeSize { small, big }

// TODO : 합성으로 설계해보기
class Badge extends StatelessWidget with _BadgeSize {
  final String text;
  final BadgeSize size;
  final BadgeCustomSpec customSpec;

  Badge({required this.text, required this.size, required this.customSpec});

  @override
  Widget build(BuildContext context){
    final badgeSpec = getBadgeSpec(size);

    return Container(
      alignment: Alignment.center,
      child: Center(
          child: Text(
            text,
            style: TextStyle( fontSize: badgeSpec.fontSize, color: customSpec.textColor ?? Colors.black, fontWeight: FontWeight.bold),
          )),
      constraints: BoxConstraints(minHeight: 15, minWidth: 15),
      padding: badgeSpec.padding,
      decoration: BoxDecoration(color: customSpec.backgroundColor, borderRadius: BorderRadius.all(Radius.circular(4))),
    );
  }

  _BadgeSpec getBadgeSpec(BadgeSize size){
    if(size == BadgeSize.small) return small;
    return big;
  }
}

mixin _BadgeSize {
  final small = _BadgeSpec(
      fontSize: 8,
      padding: EdgeInsets.symmetric(horizontal: 4)
  );
  final big = _BadgeSpec(
      fontSize: 10,
      padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2)
  );
}

class _BadgeSpec{
  final double fontSize;
  final EdgeInsetsGeometry padding;

  _BadgeSpec({required this.fontSize, required this.padding});
}

class BadgeCustomSpec{
  final Color backgroundColor;
  final Color? textColor;

  BadgeCustomSpec({required this.backgroundColor, this.textColor});
}