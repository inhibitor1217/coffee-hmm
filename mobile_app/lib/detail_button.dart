import 'package:flutter/material.dart';
import 'package:mobile_app/type.dart';
import 'package:mobile_app/util.dart';

class DetailButtonSet extends StatelessWidget {
  final _hmmLinkShare = CafeButtonModel(
      text: "흠 링크\n바로가기",
      color: Color.fromRGBO(255, 235, 77, 1),
      firstEngLetter: 'H',
      onTapped: handleLinkShareClick);
  final _naverShort = CafeButtonModel(
      text: "네이버\n바로가기",
      color: Color.fromRGBO(0, 199, 60, 1),
      firstEngLetter: 'N',
      onTapped: handleNaverClick);
  final _instagramShort = CafeButtonModel(
      text: "인스타그램\n바로가기",
      color: Color.fromRGBO(214, 42, 123, 1),
      firstEngLetter: 'I',
      onTapped: handleInstagramClick);

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.symmetric(vertical: 20),
        child: Row(
          children: [
            Expanded(child: DetailButton(button: _hmmLinkShare)),
            Expanded(child: DetailButton(button: _naverShort)),
            Expanded(child: DetailButton(button: _instagramShort))
          ],
        ));
  }
}

class DetailButton extends StatelessWidget {
  final CafeButtonModel button;

  DetailButton({required this.button});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        child: Container(
            width: 48,
            padding: EdgeInsets.symmetric(horizontal: 4),
            child: Column(
              children: [
                Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      color: button.color,
                      borderRadius: BorderRadius.circular(50),
                      border: Border.all(
                          color: button.color,
                          width: 1,
                          style: BorderStyle.solid),
                    ),
                    child: Center(
                        child: Text(
                      button.firstEngLetter,
                      style: TextStyle(
                          fontSize: 13,
                          color: Colors.white,
                          fontWeight: FontWeight.bold),
                    ))),
                Container(
                    padding: EdgeInsets.only(top: 4),
                    child: Text(
                      button.text,
                      style: TextStyle(fontSize: 11),
                      textAlign: TextAlign.center,
                    ))
              ],
            )),
        onTap: button.onTapped);
  }
}
