import 'package:flutter/material.dart';

class Header extends StatelessWidget with PreferredSizeWidget {
  final void Function()? onChangeView;
  final bool isDetailPage;

  Header({this.onChangeView, required this.isDetailPage});

  @override
  Size get preferredSize => const Size.fromHeight(48);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
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
              IconButton(onPressed: onChangeView, icon: Icon(Icons.list))
            ],
    );
  }
}
