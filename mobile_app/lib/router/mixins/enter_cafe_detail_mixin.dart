import 'package:flutter/material.dart';
import 'package:mobile_app/router/page_configuration.dart';

mixin EnterCafeDetailMixin<T extends StatefulWidget> on State<T> {
  Future<void> Function() enterDetail(String cafeId) {
    return () {
      return Router.of(context)
          .routerDelegate
          .setNewRoutePath(PageConfiguration.cafeDetail(cafeId: cafeId));
    };
  }
}
