import 'package:flutter/material.dart';
import 'package:mobile_app/type.dart';
import 'package:mobile_app/util.dart';

class DetailButtonSet extends StatelessWidget {
  final CafeModel cafe;

  DetailButtonSet({required this.cafe});
  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.symmetric(vertical: 16),
        child: Row(
          children: [
            Expanded(
              child: DetailButton(
                text: '흠 링크\n공유하기',
                imgSrc: 'assets/icon/icon_small.png',
                onPressed: () => handleLinkShareClick(
                    'https://www.coffeehmm.com/cafe/${cafe.id}'),
              ),
            ),
            Expanded(
                child: DetailButton(
                    text: '네이버\n바로가기',
                    imgSrc: 'assets/images/Naver_btnW.png',
                    onPressed: () => handleNaverClick(
                        cafe.name + ' ' + cafe.place.name, context))),
            Expanded(
                child: DetailButton(
                    text: '인스타그램\n바로가기',
                    imgSrc: 'assets/images/Instagram_Glyph_Gradient_RGB.png',
                    onPressed: () => handleInstagramClick(cafe.name, context)))
          ],
        ));
  }
}

class DetailButton extends StatelessWidget {
  final String text;
  final String imgSrc;
  final void Function() onPressed;

  DetailButton(
      {required this.text, required this.imgSrc, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    /*
      네이버 아이콘 가이드 : 최소 크기 제한 없음, 최소 여백 = width / 3.5
      인스타그램 아이콘 가이드 : 최소 크기 29x29 pixels, 최소 여백 = width / 2
      */
    return ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: Colors.transparent,
          shadowColor: Colors.transparent,
        ),
        child: Column(
          children: [
            Card(
                clipBehavior: Clip.antiAlias,
                elevation: 0,
                child: Container(
                    width: 29,
                    height: 29,
                    decoration:
                        BoxDecoration(borderRadius: BorderRadius.circular(4)),
                    child: Image.asset(imgSrc))),
            Container(
                margin: EdgeInsets.only(top: 4),
                child: Text(
                  text,
                  style: TextStyle(fontSize: 11, color: Colors.black),
                  textAlign: TextAlign.center,
                ))
          ],
        ),
        onPressed: onPressed);
  }
}
