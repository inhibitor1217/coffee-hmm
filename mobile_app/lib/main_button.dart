import 'package:flutter/material.dart';
import 'package:mobile_app/type.dart';
import 'package:mobile_app/util.dart';

class MainButtonSet extends StatelessWidget {
  final _naverShort = CafeButtonModel(
      text: "네이버 바로가기",
      firstEngLetter: 'N',
      color: Color.fromRGBO(0, 199, 60, 1),
      onTapped: handleNaverClick);
  final _instagramShort = CafeButtonModel(
      text: "인스타그램 바로가기",
      firstEngLetter: 'I',
      color: Color.fromRGBO(214, 42, 123, 1),
      onTapped: handleInstagramClick);

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.only(top: 14),
        child: Row(
          children: [
            Expanded(child: MainButton(button: _naverShort)),
            Expanded(child: MainButton(button: _instagramShort))
          ],
        ));
  }
}

class MainButton extends StatelessWidget {
  final CafeButtonModel button;

  MainButton({required this.button});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        child: Container(
            width: 16,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                    padding: EdgeInsets.only(right: 4),
                    child: Text(
                      button.firstEngLetter,
                      style: TextStyle(
                          fontSize: 12,
                          color: button.color,
                          fontWeight: FontWeight.bold),
                    )),
                Text(
                  button.text,
                  style: TextStyle(fontSize: 12),
                  textAlign: TextAlign.center,
                )
              ],
            )),
        onTap: button.onTapped);
  }
}
