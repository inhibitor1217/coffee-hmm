import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/type.dart';

class CafeImage extends StatelessWidget {
  final CafeImageModel image;

  CafeImage({required this.image});

  @override
  Widget build(BuildContext context) {
    double size = MediaQuery.of(context).size.width;
    return Container(
      height: size,
      child: CachedNetworkImage(
        imageUrl: image.relativeUri,
        fit: BoxFit.cover,
        progressIndicatorBuilder: (context, url, downloadProgress) {
          return Center(
              child: CircularProgressIndicator(
                  color: Colors.black12, value: downloadProgress.progress));
        },
        errorWidget: (context, error, stackTrace) {
          return Center(child: Text('no image'));
        },
      ),
    );
  }
}
