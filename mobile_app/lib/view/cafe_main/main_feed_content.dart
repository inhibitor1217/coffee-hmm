import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';
import 'package:mobile_app/view/common/cafe_image.dart';

class MainFeedContent extends StatefulWidget {
  final ScrollController scrollController;
  final List<CafeImageSetModel> imageSets;
  final Function(CafeModel) updateCurrentCafe;

  MainFeedContent({
    required this.scrollController,
    required this.imageSets,
    required this.updateCurrentCafe
  });

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
        crossAxisCount: 3,
        children: List.generate(widget.imageSets.length, (index){
          return GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => enterDetail(widget.imageSets[index].cafe)().then((_) => widget.updateCurrentCafe(widget.imageSets[index].cafe)),
              child: Container(
                  padding: EdgeInsets.only(right: index%3 == 2 ? 0 : 1, bottom: 1),
                  child: CafeImage(
                    image: widget.imageSets[index].image,
                    size: 200,
                  ),
                )
          );
        }),
      ),
    );
  }
}