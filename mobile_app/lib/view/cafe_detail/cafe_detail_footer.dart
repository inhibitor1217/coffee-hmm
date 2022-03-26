import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/view/common/button/button_size.dart';
import 'package:mobile_app/view/common/button/custom_icon_button.dart';
import 'package:mobile_app/util/common.dart';
import 'package:mobile_app/view/common/button/custom_button.dart';

class CafeDetailFooter extends StatelessWidget {
  final String cafeId;
  final bool isSaved;
  final Function() onSaveCafe;
  final Function()? onMenuScroll;
  final Function()? onMapScroll;

  CafeDetailFooter({
    required this.cafeId,
    required this.isSaved,
    required this.onSaveCafe,
    required this.onMenuScroll,
    required this.onMapScroll
  });

  @override
  Widget build(BuildContext context){
    return Container(
      width: MediaQuery.of(context).size.width,
      decoration: BoxDecoration(
          color: Palette.whiteTransparentBG,
          boxShadow:  [BoxShadow(
            color: Palette.lightGray50,
            spreadRadius: 1,
            blurRadius: 2,
            offset: Offset(0, -4),
          )],
      ),
      child: Row(
        children: [
          CustomIconButton(
            size: _iconButtonSize,
            content: IconButtonContent(
              text: '저장',
              icon: Icon(Icons.bookmark, color: isSaved? Palette.highlightedColor : Palette.gray, size: 20),
            ),
            onPressed: onSaveCafe,
          ),
          if(onMenuScroll != null)
            CustomIconButton(
              size: _iconButtonSize,
              content: IconButtonContent(text: '메뉴', icon: Icon(Icons.coffee_rounded, color: Palette.gray, size: 20)),
              onPressed: onMenuScroll!,
            ),
          if(onMapScroll != null)
            CustomIconButton(
              size: _iconButtonSize,
              content: IconButtonContent(text: '지도', icon: Icon(Icons.map_outlined, color: Palette.gray, size: 20)),
              onPressed: onMapScroll!,
            ),
         Expanded(
           child: CustomButton(
             size: _buttonSize,
             child: Text('카페 공유하기'),
             onPressed: () => handleLinkShareClick(
                 'https://www.coffeehmm.com/cafe/$cafeId'),
           ),
         )
        ],
      )
    );
  }
}

final _iconButtonSize = ButtonSize(
    height: 72,
    padding: EdgeInsets.only(left: 0, right: 0, top: 12, bottom: 0),
);
final _buttonSize = ButtonSize(
    height: 72,
    padding: EdgeInsets.only(left: 16, right: 16, top: 12, bottom: 20)
);
