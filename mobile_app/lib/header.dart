import 'package:flutter/material.dart';

class Header extends StatelessWidget with PreferredSizeWidget {
  final void Function()? onChangeViewMode;
  final bool isDetailPage;
  final double opacityLevel;

  Header(
      {this.onChangeViewMode,
      required this.isDetailPage,
      required this.opacityLevel});

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
      actions: isDetailPage
          ? null
          : <Widget>[
              IconButton(
                  onPressed: opacityLevel == 1.0 ? () {} : onChangeViewMode,
                  icon: Icon(Icons.list))
            ],
    );
  }
}
