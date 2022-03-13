import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';
import 'package:mobile_app/storage/cafe.dart';
import 'package:mobile_app/view/saved/saved_element.dart';

class SavedBodyContent extends StatefulWidget {
  @override
  _SavedBodyContentState createState() => _SavedBodyContentState();
}

class _SavedBodyContentState extends State<SavedBodyContent> with SavedCafe, EnterCafeDetailMixin{
  List<String> _savedCafeIds = [];

  @override
  void initState() {
    super.initState();
    getSavedCafes().then((data) => {
      setState(() {
        _savedCafeIds = data;
      })
    });
  }

  @override
  Widget build(BuildContext context){
    // FIXME 추후 수정
    if(_savedCafeIds.length > 0) {
      return Column(
        children: [
          SavedElement(cafeId: _savedCafeIds[0]),
          SavedElement(cafeId: _savedCafeIds[1])
        ],
      );
    }else {
      Text('empty');
    }
    return Center(child: CircularProgressIndicator(color: Palette.lightGray));
  }
}