import 'package:flutter/material.dart';
import 'package:mobile_app/main_bottom_sheet.dart';
import 'package:mobile_app/type.dart';
import 'package:mobile_app/util.dart';

class MainButtonSetOfSlider extends StatelessWidget {
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
        child: Row(children: [
          Expanded(child: MainButtonOfSlider(button: _naverShort)),
          Expanded(child: MainButtonOfSlider(button: _instagramShort)),
          Container(
              width: 80,
              height: 24,
              margin: EdgeInsets.symmetric(horizontal: 20),
              child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                      primary: Colors.white,
                      onPrimary: Colors.black,
                      shadowColor: Colors.transparent,
                      padding: EdgeInsets.symmetric(horizontal: 20),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4),
                      ),
                      side: BorderSide(
                          width: 1,
                          color: Colors.black12,
                          style: BorderStyle.solid),
                      textStyle: TextStyle(fontSize: 12)),
                  child: Text('핫플레이스'),
                  onPressed: () {
                    showModalBottomSheet<void>(
                        context: context,
                        builder: (BuildContext context) {
                          return Container(
                              height: 300,
                              color: Colors.transparent,
                              child: MainBottomSheet(
                                onTapped: () => Navigator.pop(context),
                              ));
                        });
                  }))
        ]));
  }
}

class MainButtonOfSlider extends StatelessWidget {
  final CafeButtonModel button;

  MainButtonOfSlider({required this.button});

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
