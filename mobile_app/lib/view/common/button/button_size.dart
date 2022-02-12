import 'package:flutter/material.dart';

class ButtonSize {
  final double height;
  final EdgeInsetsGeometry padding;

  static const defaultPadding = EdgeInsets.all(0);

  ButtonSize({required this.height, this.padding = defaultPadding});
}