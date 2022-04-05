import 'package:flutter/material.dart';
import 'package:mobile_app/router/page_configuration.dart';

class AppRouteInformationParser
    extends RouteInformationParser<PageConfiguration> {
  @override
  Future<PageConfiguration> parseRouteInformation(
      RouteInformation routeInformation) async {
    final uri = Uri.parse(routeInformation.location ?? '/');

    if (uri.pathSegments.length < 1) {
      return PageConfiguration.home;
    }

    switch (uri.pathSegments.first) {
      case 'cafe':
        if (uri.pathSegments.length < 2) {
          return PageConfiguration.home;
        }

        final cafeId = uri.pathSegments[1];
        return PageConfiguration.cafeDetail(cafeId: cafeId);
      case 'saved':
        return PageConfiguration.saved;
      case 'settings':
        return PageConfiguration.settings;
      default:
        return PageConfiguration.home;
    }
  }

  @override
  RouteInformation restoreRouteInformation(PageConfiguration configuration) {
    return RouteInformation(location: configuration.location);
  }
}
