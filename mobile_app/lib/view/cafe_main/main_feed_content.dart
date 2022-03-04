import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';
import 'package:mobile_app/view/common/cafe_image.dart';

class MainFeedContent extends StatefulWidget {
  final ScrollController scrollController;
  final List<CafeImageSetModel> imageSets;

  MainFeedContent({required this.scrollController, required this.imageSets});

  @override
  _MainFeedContent createState() => _MainFeedContent();
}

class _MainFeedContent extends State<MainFeedContent> with EnterCafeDetailMixin {
  @override
  build(BuildContext context) {
    return ScrollConfiguration(
      behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
      child:  GridView.count(
        controller: widget.scrollController,
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        crossAxisCount: 2,
        children: List.generate(widget.imageSets.length, (index){
          return GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: enterDetail(widget.imageSets[index].cafe),
              child: Center(
                child: Container(
                  padding: EdgeInsets.only(left: index%2 == 0 ? 0 : 1, bottom: 1),
                  child: CafeImage(
                    image: widget.imageSets[index].image,
                    size: 200,
                  ),
                )
            )
          );
        }),
      ),
    );
  }
}