import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/image.dart';
import 'package:mobile_app/type.dart';
import 'package:mobile_app/util/environment.dart';

class CafeImage extends StatelessWidget {
  final CafeImageModel image;
  final double size;

  CafeImage({required this.image, required this.size});

  @override
  Widget build(BuildContext context) {
    final path = Environment.imageBaseUrl;
    final group = '/cafes/';
    final uri = parseRelativeUri(image.relativeUri, group);
    final query = '?d=' + (size > 319 ? '720x720' : '240x240');

    return Container(
      height: size,
      child: CachedNetworkImage(
        imageUrl: '$path$group$uri$query',
        fit: BoxFit.cover,
        progressIndicatorBuilder: (context, url, downloadProgress) {
          return Center(
              child: SizedBox(
                  width: size * 0.1,
                  height: size * 0.1,
                  child: CircularProgressIndicator(
                      color: Colors.black12,
                      strokeWidth: size > 319 ? 5 : 2,
                      value: downloadProgress.progress)));
        },
        errorWidget: (context, error, stackTrace) {
          return Center(child: Text('no image'));
        },
      ),
    );
  }
}
