import 'package:flutter/material.dart';

@immutable
class _ImageProgressIndicatorDimension {
  final double contentSize;
  _ImageProgressIndicatorDimension({required this.contentSize});

  double get desiredSize => (contentSize * 0.25).clamp(0, 64.0);
  double get iconSize => _roundToMultipleOfFour(desiredSize * 0.825);
  double get gapSize => _roundToMultipleOfFour(desiredSize * 0.05);
  double get progressBarWidth => _roundToMultipleOfFour(desiredSize);
  double get progressBarHeight =>
      _roundToMultipleOfFour(desiredSize * 0.125).clamp(4.0, double.infinity);

  double _roundToMultipleOfFour(double value) {
    return (value * 0.25).roundToDouble() * 4.0;
  }
}

class ImageProgressIndicator extends StatelessWidget {
  static const _color = Colors.black12;

  final double contentSize;
  final double progress;

  final _ImageProgressIndicatorDimension _dimension;

  ImageProgressIndicator({required this.contentSize, required this.progress})
      : _dimension = _ImageProgressIndicatorDimension(contentSize: contentSize);

  double get _displayedProgress => progress.clamp(0.1, 1.0);

  @override
  Widget build(BuildContext context) {
    return Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Icon(Icons.image, color: _color, size: _dimension.iconSize),
      SizedBox(height: _dimension.gapSize),
      _progressBar(context)
    ]);
  }

  final _progressBarBorderRadius = BorderRadius.circular(4.0);

  Widget _progressBar(BuildContext context) {
    return Container(
        width: _dimension.progressBarWidth,
        height: _dimension.progressBarHeight,
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
}
