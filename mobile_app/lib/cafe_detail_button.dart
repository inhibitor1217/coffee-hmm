import 'package:flutter/material.dart';

class CafeDetailButtonGroup extends StatelessWidget{
  void handleLinkShareClick() {
    print('share click!');
  }

  void handleNaverClick() {
    print('naver click!');
  }

  void handleInstagramClick() {
    print('instagram click!');
  }

  @override
  Widget build(BuildContext context){
    return  Container(
        padding: EdgeInsets.symmetric(vertical: 20),
        child: Row(
          children: [
            Expanded(
                child: CafeDetailButton(
                    text: '흠 링크\n공유하기',
                    innerText: 'H',
                    onTapped: handleLinkShareClick)),
            Expanded(
                child: CafeDetailButton(
                    text: '네이버\n바로가기',
                    innerText: 'N',
                    onTapped: handleNaverClick)),
            Expanded(
                child: CafeDetailButton(
                    text: '인스타그램\n바로가기',
                    innerText: 'I',
                    onTapped: handleInstagramClick))
          ],
        ));
  }
}

class CafeDetailButton extends StatelessWidget {
  final String? text;
  final String? innerText;
  final void Function() onTapped;

  CafeDetailButton({this.text, this.innerText, required this.onTapped});

  Color _getColor(String type, double opacity) {
    switch (type) {
      case "H":
        return Color.fromRGBO(255, 235, 77, opacity);
      case "N":
        return Color.fromRGBO(0, 199, 60, opacity);
      case "I":
        return Color.fromRGBO(214, 42, 123, opacity);
      default:
        return Color.fromRGBO(51, 94, 207, opacity);
    }
  }

  @override
  Widget build(BuildContext context) {
    final type = (innerText ?? 'Others')[0].toUpperCase();

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
                    color: _getColor(type, 0.9),
                    borderRadius: BorderRadius.circular(50),
                    border: Border.all(
                        color: _getColor(type, 1),
                        width: 1,
                        style: BorderStyle.solid),
                  ),
                  child: Center(
                      child: Text(
                    type,
                    style: TextStyle(
                        fontSize: 13,
                        color: Colors.white,
                        fontWeight: FontWeight.bold),
                  ))),
              Container(
                  padding: EdgeInsets.only(top: 4),
                  child: Text(
                    text ?? '',
                    style: TextStyle(fontSize: 11),
                    textAlign: TextAlign.center,
                  ))
            ],
          )),
      onTap: () {
        onTapped();
      },
    );
  }
}
