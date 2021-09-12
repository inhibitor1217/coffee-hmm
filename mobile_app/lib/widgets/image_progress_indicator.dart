import 'package:flutter/material.dart';

class ImageProgressIndicator extends StatelessWidget {
  static const _color = Colors.black12;

  final double contentSize;
  final double progress;
  ImageProgressIndicator({required this.contentSize, required this.progress});

  double get _displayedProgress => progress.clamp(0.1, 1.0);
  double get _desiredSize => contentSize * 0.25;

  @override
  Widget build(BuildContext context) {
    return Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Icon(Icons.image,
          color: _color, size: _roundToMultipleOfFour(_desiredSize * 0.75)),
      SizedBox(height: _roundToMultipleOfFour(_desiredSize * 0.05)),
      _progressBar(context)
    ]);
  }

  final _progressBarBorderRadius = BorderRadius.circular(4.0);

  double get _progressBarWidth => _roundToMultipleOfFour(_desiredSize);
  double get _progressBarHeight =>
      _roundToMultipleOfFour(_progressBarWidth * 0.125)
          .clamp(4.0, double.infinity);

  Widget _progressBar(BuildContext context) {
    return Container(
        width: _progressBarWidth,
        height: _progressBarHeight,
        padding: const EdgeInsets.all(2.0),
        decoration: BoxDecoration(
            color: _color, borderRadius: _progressBarBorderRadius),
        child: LayoutBuilder(
            builder: (context, constraints) => Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _animatedProgress(context, maxSize: constraints.maxWidth),
                    Spacer()
                  ],
                )));
  }

  Widget _animatedProgress(BuildContext context, {required double maxSize}) {
    return AnimatedContainer(
        decoration: BoxDecoration(
            color: Colors.white, borderRadius: _progressBarBorderRadius),
        duration: const Duration(milliseconds: 150),
        curve: Curves.ease,
        constraints: BoxConstraints(maxWidth: maxSize * _displayedProgress));
  }

  double _roundToMultipleOfFour(double value) {
    return (value * 0.25).roundToDouble() * 4.0;
  }
}
