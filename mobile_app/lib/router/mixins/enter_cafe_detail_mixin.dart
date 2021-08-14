import 'package:flutter/material.dart';
import 'package:mobile_app/router/page_configuration.dart';
import 'package:mobile_app/type.dart';

mixin EnterCafeDetailMixin<T extends StatefulWidget> on State<T> {
  void Function() enterDetail(CafeModel cafe) {
    return () {
      Router.of(context)
          .routerDelegate
          .setNewRoutePath(PageConfiguration.cafeDetail(cafeId: cafe.id));
    };
  }
}
