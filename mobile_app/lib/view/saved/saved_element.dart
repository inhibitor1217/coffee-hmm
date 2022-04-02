import 'package:flutter/material.dart';
import 'package:mobile_app/api/api.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';

class SavedElement extends StatefulWidget {
  final String cafeId;

  SavedElement({required this.cafeId});

  @override
  _SavedElementState createState() => _SavedElementState();
}

class _SavedElementState extends State<SavedElement> {
  late Future<SingleCafeResponse> _cafeResponse;
  late CafeModel? _cafe;

  @override
  void initState(){
    super.initState();
    _cafeResponse = fetchCafe(widget.cafeId);
    _cafeResponse.then((data){
      setState(() {
        _cafe = data.cafe;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    // FIXME : 예시
    return FutureBuilder(
      future: _cafeResponse,
      builder: (context, snapshot){
        if(snapshot.hasData){
          return Text(_cafe?.name ?? '');
        }
        return Center(child: CircularProgressIndicator(color: Palette.lightGray));
      },
    );
  }
}