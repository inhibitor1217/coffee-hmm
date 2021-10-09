import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/router/page_configuration.dart';

mixin EnterCafeDetailMixin<T extends StatefulWidget> on State<T> {
  void Function() enterDetail(CafeModel cafe) {
    return () {
      Router.of(context)
          .routerDelegate
          .setNewRoutePath(PageConfiguration.cafeDetail(cafeId: cafe.id));
    };
  }
}
