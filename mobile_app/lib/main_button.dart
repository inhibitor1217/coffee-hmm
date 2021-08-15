import 'package:flutter/material.dart';
import 'package:mobile_app/main_bottom_sheet.dart';
import 'package:mobile_app/type.dart';
import 'package:mobile_app/util.dart';

class MainButtonSetOfSlider extends StatelessWidget {
  final List<CafeModel> hotCafeList;
  final void Function() onTappedHotCafes;
  final CafeModel cafe;

  MainButtonSetOfSlider(
      {required this.hotCafeList,
      required this.onTappedHotCafes,
      required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.symmetric(horizontal: 20),
        child: Row(children: [
          MainButtonOfSlider(
            imgSrc: 'assets/images/Naver_icon.png',
            onTapped: () =>
                handleNaverClick(cafe.name + ' ' + cafe.place.name, context),
          ),
          SizedBox(width: 15),
          MainButtonOfSlider(
              imgSrc: 'assets/images/Instagram_Glyph_Gradient_RGB.png',
              onTapped: () => handleInstagramClick(cafe.name, context)),
          Spacer(),
          Container(
              width: 80,
              height: 29,
              child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                      primary: Colors.white,
                      onPrimary: Colors.black,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4),
                      ),
                      padding: EdgeInsets.all(0),
                      side: BorderSide(
                          width: 1,
                          color: Colors.black12,
                          style: BorderStyle.solid),
                      textStyle: TextStyle(fontSize: 12)),
                  child: Text('핫플레이스 '),
                  onPressed: () {
                    showModalBottomSheet<void>(
                        context: context,
                        builder: (BuildContext context) {
                          onTappedHotCafes();
                          return Container(
                              height: 300,
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
    return IconButton(
        onPressed: onTapped,
        padding: EdgeInsets.zero,
        constraints: BoxConstraints(),
        icon: Image.asset(imgSrc, width: 29, height: 29));
  }
}
