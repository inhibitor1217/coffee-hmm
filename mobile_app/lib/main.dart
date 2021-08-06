import 'package:flutter/material.dart';
import 'package:mobile_app/detail_page.dart';
import 'package:mobile_app/main_page.dart';
import 'package:mobile_app/type.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  CafeModel? _selectedCafe;

  void handleCafeTapped(CafeModel cafe) {
    setState(() {
      _selectedCafe = cafe;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: '카페 추천은, 커피흠',
        theme: new ThemeData(
          canvasColor: Colors.transparent,
          scaffoldBackgroundColor: Colors.white,
        ),
        home: Navigator(
          pages: [
            MaterialPage(
                key: ValueKey('MainPage'),
                child: MainScreen(onTapped: handleCafeTapped)),
            if (_selectedCafe != null) CafeDetailPage(cafe: _selectedCafe!)
          ],
          onPopPage: (route, result) {
            if (!route.didPop(result)) {
              return false;
            }
            setState(() {
              _selectedCafe = null;
            });

            return true;
          },
        ),
        debugShowCheckedModeBanner: false);
  }
}
