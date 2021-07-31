import 'package:flutter/material.dart';

class Header extends StatelessWidget with PreferredSizeWidget {
  final void Function()? onChangeViewMode;
  final bool isTableViewMode;
  final bool isDetailPage;
  final bool isBottomSheetOpen;

  Header(
      {this.onChangeViewMode,
      required this.isTableViewMode,
      required this.isDetailPage,
      required this.isBottomSheetOpen});

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
      actions: isDetailPage
          ? null
          : <Widget>[
              isTableViewMode
                  ? IconButton(
                      onPressed: isBottomSheetOpen ? () {} : onChangeViewMode,
                      icon: Icon(Icons.image))
                  : IconButton(
                      onPressed: isBottomSheetOpen ? () {} : onChangeViewMode,
                      icon: Icon(Icons.list))
            ],
    );
  }
}
