import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';
import 'package:mobile_app/storage/cafe.dart';
import 'package:mobile_app/view/common/feed.dart';
import 'package:mobile_app/view/saved/saved_element.dart';

class SavedBodyContent extends StatefulWidget {
  @override
  _SavedBodyContentState createState() => _SavedBodyContentState();
}

class _SavedBodyContentState extends State<SavedBodyContent> with SavedCafe, EnterCafeDetailMixin{
  final ScrollController _scrollController = ScrollController();
  List<String> _savedCafeIds = [];
  bool _didUpdate = false;

  @override
  void initState() {
    super.initState();
    _updateSavedCafeIds();
  }
  @override
  void didUpdateWidget(covariant SavedBodyContent oldWidget) {
    super.didUpdateWidget(oldWidget);
    if(mounted){
      _beforeUpdate();
      _updateSavedCafeIds();
    }
  }
  void _beforeUpdate(){
    setState(() {
      _didUpdate = false;
    });
    _savedCafeIds.clear();
  }
  void _updateSavedCafeIds() {
    getAllSavedCafeIds().then((data) => {
      setState(() {
        _savedCafeIds = data.cast<String>();
        _didUpdate = true;
      })
    });
  }

  @override
  Widget build(BuildContext context){
    if(_savedCafeIds.length > 0) {
      return Feed(
        scrollController: _scrollController,
        children: _savedCafeIds.map((id) =>  GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: enterDetail(id),
          child: Container(
            padding: EdgeInsets.only(right: _savedCafeIds.indexOf(id)%3 == 2 ? 0 : 1, bottom: 1),
            child: SavedElement(cafeId: id),
          ),
        )).toList(),
      );
    } else if(_didUpdate && _savedCafeIds.length == 0){
      return  Center(child: Text('카페를 추가해주세요 :)'));
    }
    return Center(child: CircularProgressIndicator(color: Palette.lightGray));
  }
}