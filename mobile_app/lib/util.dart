import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';

void handleLinkShareClick(String link) {
  Clipboard.setData(ClipboardData(text: link));
  Fluttertoast.showToast(
    msg: '커피흠 링크가 복사되었습니다.',
    backgroundColor: Colors.white,
    textColor: Colors.black,
  );
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
