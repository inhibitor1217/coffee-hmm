import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:mobile_app/webView.dart';

void handleLinkShareClick(String link) {
  Clipboard.setData(ClipboardData(text: link));
  Fluttertoast.showToast(
    msg: '커피흠 링크가 복사되었습니다.',
    backgroundColor: Colors.white,
    textColor: Colors.black,
  );
}

void handleNaverClick(String searchTerm, BuildContext context) {
  var uri = Uri.encodeFull(searchTerm);

  Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) => WebViewPage(
              uri: 'https://m.search.naver.com/search.naver?query=' + uri)));
}

void handleInstagramClick(String tag, BuildContext context) {
  var uri = Uri.encodeFull(tag);

  Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) => WebViewPage(
              uri: 'https://www.instagram.com/explore/tags/' + uri)));
}

class ListUtils {
  static Iterable<T> join<T>(Iterable<T> iterable, {required T separator}) =>
      iterable.fold(Iterable<T>.empty(),
          (p, v) => p.isEmpty ? [...p, v] : [...p, separator, v]);
}
