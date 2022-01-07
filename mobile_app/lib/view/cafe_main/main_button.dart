import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/common.dart';
import 'package:mobile_app/view/cafe_main/main_bottom_sheet.dart';

class MainButtonSetOfSlider extends StatelessWidget {
  final List<CafeModel> hotCafeList;
  final CafeModel cafe;

  MainButtonSetOfSlider({required this.hotCafeList, required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.symmetric(horizontal: 20),
        child: Row(children: [
          MainButtonOfSlider(
            imgSrc: 'assets/images/Naver_btnW.png',
            onTapped: () =>
                handleNaverClick(cafe.name + ' ' + cafe.place.name, context),
          ),
          SizedBox(width: 16),
          MainButtonOfSlider(
              imgSrc: 'assets/images/Instagram_Glyph_Gradient_RGB.png',
              onTapped: () => handleInstagramClick(cafe.name, context)),
          Spacer(),
          Container(
              alignment: Alignment.center,
              child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(horizontal: 8),
                    primary: Palette.lightGray,
                    onPrimary: Colors.black,
                    shadowColor: Colors.transparent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  child: Text(
                    '핫플레이스',
                    style: TextStyle(fontSize: 12, color: Palette.darkGray),
                  ),
                  onPressed: () {
                    showModalBottomSheet<void>(
                        context: context,
                        builder: (BuildContext context) {
                          return Container(
                              height: 320,
                              color: Colors.transparent,
                              child: MainBottomSheet(
                                hotCafeList: hotCafeList,
                                onClose: () => Navigator.pop(context),
                              ));
                        });
                  }))
        ]));
  }
}

class MainButtonOfSlider extends StatelessWidget {
  final String imgSrc;
  final void Function() onTapped;

  MainButtonOfSlider({required this.imgSrc, required this.onTapped});

  @override
  Widget build(BuildContext context) {
    /*
      네이버 아이콘 가이드 : 최소 크기 제한 없음, 최소 여백 = width / 3.5
      인스타그램 아이콘 가이드 : 최소 크기 29x29 pixels, 최소 여백 = width / 2
      */
    return SizedBox(
      width: 29,
      height: 29,
      child: IconButton(
          onPressed: onTapped,
          padding: EdgeInsets.zero,
          constraints: BoxConstraints(),
          icon: Image.asset(imgSrc)),
    );
  }
}
