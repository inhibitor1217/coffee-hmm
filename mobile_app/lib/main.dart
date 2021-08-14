import 'package:flutter/material.dart';
import 'package:mobile_app/router/app_route_information_parser.dart';
import 'package:mobile_app/router/app_router_delegate.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final _routerDelegate = AppRouterDelegate();
  final _routeInformationParser = AppRouteInformationParser();

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
        title: '카페 추천은, 커피흠',
        theme: new ThemeData(
          canvasColor: Colors.transparent,
          splashColor: Colors.transparent,
          highlightColor: Colors.transparent,
          hoverColor: Colors.transparent,
          scaffoldBackgroundColor: Colors.white,
        ),
        routerDelegate: _routerDelegate,
        routeInformationParser: _routeInformationParser,
        debugShowCheckedModeBanner: false);
  }
}
