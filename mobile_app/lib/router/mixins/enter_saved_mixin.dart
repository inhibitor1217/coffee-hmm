import 'package:flutter/material.dart';
import 'package:mobile_app/router/page_configuration.dart';

mixin EnterSaved<T> on Function {
  void Function() enterSaved(BuildContext context) {
    return ()  =>
      Router.of(context)
          .routerDelegate
          .setNewRoutePath(PageConfiguration.saved);
  }
}