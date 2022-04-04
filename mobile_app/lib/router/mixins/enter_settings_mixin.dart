import 'package:flutter/material.dart';
import 'package:mobile_app/router/page_configuration.dart';

mixin EnterSettings<T extends StatelessWidget> on Function {
  void Function() enterSettings(BuildContext context) {
    return () =>
        Router
            .of(context)
            .routerDelegate
            .setNewRoutePath(PageConfiguration.settings);
  }
}