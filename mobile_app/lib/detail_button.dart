import 'package:flutter/material.dart';
import 'package:mobile_app/util.dart';

class DetailButtonSet extends StatelessWidget {
  final String cafeId;
  final String cafeName;
  final String cafePlaceName;

  DetailButtonSet(
      {required this.cafeId,
      required this.cafeName,
      required this.cafePlaceName});
  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.symmetric(vertical: 20),
        child: Row(
          children: [
            Expanded(
                child: DetailButton(
                    text: '흠 링크\n복사하기',
                    imgSrc: 'assets/images/Hmm_icon.png',
                    onPressed: () => handleLinkShareClick(
                        'https://www.coffeehmm.com/cafe/$cafeId'))),
            Expanded(
                child: DetailButton(
                    text: '네이버\n바로가기',
                    imgSrc: 'assets/images/Naver_icon.png',
                    onPressed: () => handleNaverClick(
                        cafeName + ' ' + cafePlaceName, context))),
            Expanded(
                child: DetailButton(
                    text: '인스타그램\n바로가기',
                    imgSrc: 'assets/images/Instagram_Glyph_Gradient_RGB.png',
                    onPressed: () => handleInstagramClick(cafeName, context)))
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
            Image.asset(imgSrc, width: 29, height: 29),
            Container(
                padding: EdgeInsets.only(top: 15),
                child: Text(
                  text,
                  style: TextStyle(fontSize: 12, color: Colors.black),
                  textAlign: TextAlign.center,
                ))
          ],
        ),
        onPressed: onPressed);
  }
}
