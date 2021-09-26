import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/router/page_configuration.dart';
import 'package:mobile_app/util/app_stage.dart';
import 'package:mobile_app/util/environment.dart';

mixin _HeaderSpec on StatelessWidget {
  final _logo = Text('coffee hmm',
      textAlign: TextAlign.center,
      style: TextStyle(fontSize: 13, color: Palette.darkGray));

  bool get _showMoreAction {
    return Environment.appStage == AppStage.development;
  }
}

class _MoreActionButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.info_rounded),
      onPressed: _enterSettings(context),
    );
  }

  void Function() _enterSettings(BuildContext context) {
    return () => Router.of(context)
        .routerDelegate
        .setNewRoutePath(PageConfiguration.settings);
  }
}

class MainHeader extends StatelessWidget with PreferredSizeWidget, _HeaderSpec {
  final void Function()? onChangeViewMode;
  final bool isTableViewMode;

  MainHeader({this.onChangeViewMode, required this.isTableViewMode});

  @override
  Size get preferredSize => Size.fromHeight(48);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: isTableViewMode ? Colors.white : Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: Palette.gray),
      title: _logo,
      centerTitle: true,
      actions: [
        IconButton(
            onPressed: onChangeViewMode,
            icon: Icon(isTableViewMode ? Icons.grid_view_sharp : Icons.list)),
        if (_showMoreAction) _MoreActionButton(),
      ],
    );
  }
}

class BaseHeader extends StatelessWidget with PreferredSizeWidget, _HeaderSpec {
  @override
  Size get preferredSize => Size.fromHeight(48);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: Palette.gray),
      title: _logo,
      centerTitle: true,
      actions: [
        if (_showMoreAction) _MoreActionButton(),
      ],
    );
  }
}

class DetailHeader extends StatelessWidget
    with PreferredSizeWidget, _HeaderSpec {
  final String title;

  DetailHeader({required this.title});

  @override
  Size get preferredSize => Size.fromHeight(48);

  @override
  Widget build(BuildContext context) {
    return AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          color: Palette.gray,
          icon: Icon(
            Icons.arrow_back_rounded,
            size: 20.0,
          ),
          onPressed: () => {Navigator.pop(context, true)},
        ),
        title: Text(title,
            textAlign: TextAlign.center,
            style: TextStyle(
                fontSize: 13,
                color: Palette.darkGray,
                fontWeight: FontWeight.bold)),
        centerTitle: true);
  }
}