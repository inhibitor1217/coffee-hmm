import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';
import 'package:mobile_app/storage/cafe.dart';

class SavedBodyContent extends StatefulWidget {
  @override
  _SavedBodyContentState createState() => _SavedBodyContentState();
}

class _SavedBodyContentState extends State<SavedBodyContent> with SavedCafe, EnterCafeDetailMixin{
  final ScrollController _scrollController = ScrollController();
  List<CafeModel> _savedCafes = [];

  @override
  void initState() {
    super.initState();
    getSavedCafes().then((data) => {
      setState((){
        _savedCafes = data;
      })
    });
  }

  @override
  Widget build(BuildContext context){
    return Text('TODO');
  }
}