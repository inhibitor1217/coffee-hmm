import 'dart:async';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

abstract class SavedCafeModel {
  List<String> get cafeIds;

  dynamic toJsonObject();
}

class SavedCafeModelV1 implements SavedCafeModel {
  final List<String> cafeIds;

  SavedCafeModelV1({required this.cafeIds});

  dynamic toJsonObject() {
    return {
      'version': '1',
      'cafeIds': cafeIds,
    };
  }
}

// class SavedCafeItemModelV2 {
//   final String id;
//   final String timestamp;
//
//   SavedCafeItemModelV2({required this.id, required this.timestamp});
// }
//
// class SavedCafeModelV2 implements SavedCafeModel {
//   final List<SavedCafeItemModelV2> cafes;
//
//   SavedCafeModelV2({required this.cafes});
//
//   List<String> get cafeIds {
//     return this.cafes.map((cafe) { return cafe.id; }).toList();
//   }
//
//   dynamic toJsonObject() {
//     return {
//       'version': '2',
//       'cafes': cafes,
//     };
//   }
// }

mixin SavedCafe {
  final String _key = 'savedCafes';

  Future<List<String>> getAllSavedCafeIds() async {
    final SharedPreferences prefs = await _prefs;
    final List<String>? _jsonList = prefs.getStringList(_key);

    if(_jsonList == null) return [];
 
    try {
      final _cafeIds = _jsonList
          .map(jsonDecode)
          .map((json) {
            switch (json['version'] as String) {
              case '1':
                final _modelV1 = SavedCafeModelV1(cafeIds: (json['cafeIds']).cast<String>());
                return _modelV1.cafeIds;
              // case '2':
              //   final _modelV2 = SavedCafeModelV2(cafes: data['cafes'].map((cafeItem) =>
              //       SavedCafeItemModelV2(id: cafeItem['id'], timestamp: cafeItem['timestamp'])
              //   ));
              //   return _modelV2.cafeIds;
              default:
                return <String>[];
            }
          })
          .fold<List<String>>([], (prev, element) => prev..addAll(element));

      return _cafeIds;
    } catch (e){
      return [];
    }
  }

  void saveCafe(String cafeId) async {
    final SharedPreferences prefs = await _prefs;
    final List<String>? _jsonList = prefs.getStringList(_key);

    if(_jsonList == null) {
      final _initialElement = SavedCafeModelV1(cafeIds: [cafeId]).toJsonObject();
      await prefs.setStringList(_key, [jsonEncode(_initialElement)]);

      return;
    }

    _jsonList
      .map(jsonDecode)
      .forEach((json){
        switch (json['version'] as String) {
          case '1':
            final _modelV1 = SavedCafeModelV1(cafeIds: (json['cafeIds']).cast<String>());
            final _updatedCafeIds =  _modelV1.cafeIds..add(cafeId);
            final _newElement = SavedCafeModelV1(cafeIds:_updatedCafeIds).toJsonObject();
            _jsonList[0] = jsonEncode(_newElement);
            break;
          default:
            break;
        }
      }
    );

    await prefs.setStringList(_key, _jsonList);
  }

  void removeCafe(String cafeId) async {
    final SharedPreferences prefs = await _prefs;
    final List<String>? _jsonList = prefs.getStringList(_key);

    if(_jsonList == null) return;

    _jsonList
      .map(jsonDecode)
      .forEach((json){
        switch (json['version'] as String) {
          case '1':
            final _modelV1 = SavedCafeModelV1(cafeIds: (json['cafeIds']).cast<String>());
            _modelV1.cafeIds.removeWhere((id) => id == cafeId);
            _jsonList[0] = jsonEncode(_modelV1.toJsonObject());
            break;
          default:
            return;
        }
      });

    await prefs.setStringList(_key, _jsonList);
  }

  Future<void> resetSavedCafes() async {
    final SharedPreferences prefs = await _prefs;

    await prefs.remove(_key);
  }
}