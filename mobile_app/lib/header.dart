import 'package:flutter/material.dart';
import 'package:mobile_app/router/page_configuration.dart';

const _titleStyle = TextStyle(
  fontSize: 12,
  color: Colors.black,
);

final _headerTitle =
    Text('coffeehmm', textAlign: TextAlign.center, style: _titleStyle);

const _idleIconColor = Colors.black38;
const _activeIconColor = Color.fromRGBO(155, 218, 218, 1);

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

class MainHeader extends StatelessWidget with PreferredSizeWidget {
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
      iconTheme: IconThemeData(color: _idleIconColor),
      title: _headerTitle,
      centerTitle: true,
      actions: [
        IconButton(
            onPressed: onChangeViewMode,
            icon: Icon(Icons.list,
                color: isTableViewMode ? _activeIconColor : null)),
        _MoreActionButton(),
      ],
    );
  }
}

class BaseHeader extends StatelessWidget with PreferredSizeWidget {
  @override
  Size get preferredSize => Size.fromHeight(48);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: _idleIconColor),
      title: _headerTitle,
      centerTitle: true,
      actions: [
        _MoreActionButton(),
      ],
    );
  }
}
