import 'package:flutter/material.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';

class Feed extends StatefulWidget {
  final ScrollController scrollController;
  final List<Widget> children;
  final int crossAxisCount;

  Feed({
    required this.scrollController,
    required this.children,
    this.crossAxisCount = 3
  });

  @override
  _Feed createState() => _Feed();
}

class _Feed extends State<Feed> with EnterCafeDetailMixin {
  @override
  Widget build(BuildContext context) {
    return ScrollConfiguration(
      behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
      child:  GridView.count(
        controller: widget.scrollController,
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        crossAxisCount: widget.crossAxisCount,
        children: widget.children,
      ),
    );
  }
}