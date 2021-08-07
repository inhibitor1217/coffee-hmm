import 'package:flutter/material.dart';

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
      iconTheme: IconThemeData(color: Colors.black45),
      title: Text('coffeehmm',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            color: Colors.black,
          )),
      centerTitle: true,
      actions: <Widget>[
        IconButton(
            onPressed: onChangeViewMode,
            icon: Icon(Icons.list,
                color: isTableViewMode
                    ? Color.fromRGBO(155, 218, 218, 1)
                    : Colors.black38))
      ],
    );
  }
}

class DetailHeader extends StatelessWidget with PreferredSizeWidget {
  @override
  Size get preferredSize => Size.fromHeight(48);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: Colors.black45),
      title: Text('coffeehmm',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            color: Colors.black,
          )),
      centerTitle: true,
    );
  }
}
