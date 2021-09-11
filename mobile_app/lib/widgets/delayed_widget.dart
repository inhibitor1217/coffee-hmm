import 'dart:async';

import 'package:flutter/material.dart';

class DelayedWidget extends StatefulWidget {
  final Widget child;
  final Duration delay;
  const DelayedWidget(
      {Key? key,
      required this.child,
      this.delay = const Duration(milliseconds: 500)})
      : super(key: key);

  @override
  _DelayedWidgetState createState() => _DelayedWidgetState();
}

class _DelayedWidgetState extends State<DelayedWidget> {
  bool _show = false;
  late Timer _timer;

  @override
  void initState() {
    super.initState();

    _timer = Timer(
        widget.delay,
        () => setState(() {
              _show = true;
            }));
  }

  @override
  void dispose() {
    super.dispose();

    _timer.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      opacity: _show ? 1.0 : 0.0,
      duration: const Duration(milliseconds: 150),
      child: widget.child,
    );
  }
}
