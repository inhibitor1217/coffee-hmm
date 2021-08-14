import 'package:flutter/material.dart';
import 'package:mobile_app/detail_page.dart';
import 'package:mobile_app/main_page.dart';
import 'package:mobile_app/router/app_state.dart';
import 'package:mobile_app/router/page_configuration.dart';
import 'package:mobile_app/router/pages.dart';

class AppRouterDelegate extends RouterDelegate<PageConfiguration>
    with ChangeNotifier, PopNavigatorRouterDelegateMixin<PageConfiguration> {
  final GlobalKey<NavigatorState> navigatorKey;

  /* App State */
  AppState _state;

  AppRouterDelegate()
      : navigatorKey = GlobalKey(),
        _state = AppState.initial;

  List<MaterialPage> get pages {
    return List.unmodifiable([
      MaterialPage(child: MainScreen(), arguments: PageConfiguration.home),
      if (_state.isOnDetailPage)
        MaterialPage(
          child: CafeDetailScreen(cafeId: _state.selectedCafeId!),
          arguments:
              PageConfiguration.cafeDetail(cafeId: _state.selectedCafeId!),
        ),
      if (_state.isOnSettings)
        MaterialPage(
          child: Container(child: Center(child: Text('Settings'))),
          arguments: PageConfiguration.settings,
        )
    ]);
  }

  @override
  PageConfiguration? get currentConfiguration {
    if (pages.isEmpty) {
      return null;
    }

    return pages.last.arguments as PageConfiguration;
  }

  @override
  Widget build(BuildContext context) {
    return Navigator(
      key: navigatorKey,
      pages: pages,
      onPopPage: _onPopPage,
    );
  }

  bool _onPopPage(Route<dynamic> route, dynamic result) {
    if (!route.didPop(result)) {
      return false;
    }

    if (_state.isOnSettings) {
      _state.exitSettings();
    } else if (_state.isOnDetailPage) {
      _state.exitCafeDetails();
    } else {
      return false;
    }

    notifyListeners();

    return true;
  }

  @override
  Future<void> setNewRoutePath(PageConfiguration configuration) async {
    switch (configuration.type) {
      case Pages.cafeDetail:
        _state.enterCafeDetails(configuration.get<String>('cafeId'));
        notifyListeners();
        break;
      case Pages.settings:
        _state.enterSettings();
        notifyListeners();
        break;
      default:
        break;
    }
  }
}
