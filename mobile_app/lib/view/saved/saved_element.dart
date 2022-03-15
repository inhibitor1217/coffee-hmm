import 'package:flutter/material.dart';
import 'package:mobile_app/api/api.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/common/cafe_image.dart';
import 'package:mobile_app/view/common/skeleton.dart';

class SavedElement extends StatefulWidget {
  final String cafeId;

  SavedElement({required this.cafeId});

  @override
  _SavedElementState createState() => _SavedElementState();
}

class _SavedElementState extends State<SavedElement> {
  late Future<SingleCafeResponse> _cafeResponse;
  late CafeModel _cafe;

  @override
  void initState(){
    super.initState();
    _cafeResponse = fetchCafe(widget.cafeId);
    _cafeResponse.then((data){
      if(mounted){
        setState(() {
          _cafe = data.cafe;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _cafeResponse,
      builder: (context, snapshot){
        if(snapshot.hasData){
          return Container(
            child: CafeImage(
              image: _cafe.image.mainImage,
              size: 200,
            ),
          );
        }
        return Skeleton();
      },
    );
  }
}