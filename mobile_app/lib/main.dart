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
  String? _selectedCafeId;

  void handleCafeTapped(CafeModel cafe) {
    setState(() {
      _selectedCafeId = cafe.id;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: '카페 추천은, 커피흠',
        theme: new ThemeData(
          canvasColor: Colors.transparent,
          splashColor: Colors.transparent,
          highlightColor: Colors.transparent,
          hoverColor: Colors.transparent,
          scaffoldBackgroundColor: Colors.white,
        ),
        home: Navigator(
          pages: [
            MaterialPage(
                key: ValueKey('MainPage'),
                child: MainScreen(onTapped: handleCafeTapped)),
            if (_selectedCafeId != null)
              CafeDetailPage(cafeId: _selectedCafeId!),
          ],
          onPopPage: (route, result) {
            if (!route.didPop(result)) {
              return false;
            }
            setState(() {
              _selectedCafeId = null;
            });

            return true;
          },
        ),
        debugShowCheckedModeBanner: false);
  }
}
