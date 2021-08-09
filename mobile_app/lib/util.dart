import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void handleLinkShareClick(String link, BuildContext context) {
  Clipboard.setData(ClipboardData(text: link));
  showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        Future.delayed(Duration(seconds: 1), () {
          Navigator.pop(context);
        });
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          insetPadding: EdgeInsets.symmetric(horizontal: 80, vertical: 20),
          content: Text('커피흠 링크가 복사되었습니다.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: Colors.black)),
        );
      });
}

void handleNaverClick() {
  print('naver click!');
}

void handleInstagramClick() {
  print('instagram click!');
}

class ListUtils {
  static Iterable<T> join<T>(Iterable<T> iterable, {required T separator}) =>
      iterable.fold(Iterable<T>.empty(),
          (p, v) => p.isEmpty ? [...p, v] : [...p, separator, v]);
}
