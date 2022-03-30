import 'dart:async';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'model/cafe.dart';

final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

mixin SavedCafe {
  final String _key = 'savedCafes';
  final String _latestVersion = '1';

  dynamic _migrate() async {
    final SharedPreferences prefs = await _prefs;
    final List<String> _jsonList = prefs.getStringList(_key) ?? [];

    /* migrate all data from version 1 to version before latest
    * latest version : 1
    */
    final _migratedToV2 = _jsonList
        .map(jsonDecode)
        .map((json) {
          final version = json['version'] as String;
          switch (version) {
            case '1':
              final _modelV1 = SavedCafeModelV1.fromJson(json);
              final _tempTimestamp = '0000-00-00';
              return _modelV1.cafeIds.fold<List<SavedCafeItemModelV2>>([], (prev, id) => prev..add(SavedCafeItemModelV2(id: id, timestamp: _tempTimestamp)));
            default:
              return <SavedCafeItemModelV2>[];
          }
        })
        .fold<List<SavedCafeItemModelV2>>([], (prev, element) => prev..addAll(element));

    final _latestIndex = int.parse(_latestVersion) - 1;
    _jsonList..add('');
    _jsonList[_latestIndex] = jsonEncode(SavedCafeModelV2(cafes: _migratedToV2).toJsonObject());
    await prefs.setStringList(_key, _jsonList);
  }

  Future<List<String>> getAllSavedCafeIds() async {
    final SharedPreferences prefs = await _prefs;
    final List<String> _jsonList = prefs.getStringList(_key) ?? [];

    try {
      final _allCafeIds = _jsonList
          .map(jsonDecode)
          .map((json) {
            switch (json['version'] as String) {
              case '1':
                final _modelV1 = SavedCafeModelV1.fromJson(json);
                return _modelV1.cafeIds;
              case '2':
                final _modelV2 = SavedCafeModelV2.fromJson(json);
                return _modelV2.cafeIds;
              default:
                return <String>[];
            }
          })
          .fold<List<String>>([], (prev, element) => prev..addAll(element));

      return _allCafeIds.toSet().toList();
    } catch (e){
      return [];
    }
  }

  void saveCafe(String cafeId) async {
    final SharedPreferences prefs = await _prefs;
    final List<String> _jsonList = prefs.getStringList(_key) ?? [];

    if(_jsonList.length < int.parse(_latestVersion)){
      switch(_latestVersion){
        case '1':
          final _newElement = SavedCafeModelV1(cafeIds: [cafeId]).toJsonObject();
          await prefs.setStringList(_key, [jsonEncode(_newElement)]);

          return;
        case '2':
          await _migrate();
          final _json = json.decode(_jsonList[1]);
          final _migratedCafes = SavedCafeModelV2.fromJson(_json).cafes;
          final _newElement = SavedCafeModelV2(cafes: _migratedCafes..add(SavedCafeItemModelV2(id: cafeId, timestamp: '0000-00-00'))); // TODO: get timestamp from parameter
          await prefs.setStringList(_key, _jsonList..add(jsonEncode(_newElement.toJsonObject())));

          return;
        default:
          return;
      }
    }

    _jsonList
      .map(jsonDecode)
      .forEach((json) async {
        switch (json['version'] as String) {
          case '1':
            final _currentCafes = [...SavedCafeModelV1.fromJson(json).cafeIds];
            final _updatedCafes =  _currentCafes..add(cafeId);
            final _updatedElement = SavedCafeModelV1(cafeIds: _updatedCafes);
            _jsonList[0] = jsonEncode(_updatedElement.toJsonObject());
            break;
          case '2':
            final _currentCafes = [...SavedCafeModelV2.fromJson(json).cafes];
            final _updatedCafes = _currentCafes..add(SavedCafeItemModelV2(id: cafeId, timestamp: '0000-00-00')); // TODO: get timestamp from parameter
            final _updatedElement = SavedCafeModelV2(cafes: _updatedCafes);
            _jsonList[1] = jsonEncode(_updatedElement.toJsonObject());
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
    final List<String> _jsonList = prefs.getStringList(_key) ?? [];

    _jsonList
      .map(jsonDecode)
      .forEach((json){
        switch (json['version'] as String) {
          case '1':
            final _currentCafes = [...SavedCafeModelV1.fromJson(json).cafeIds];
            final _updatedCafes = _currentCafes..removeWhere((id) => id == cafeId);
            final _updatedElement = SavedCafeModelV1(cafeIds: _updatedCafes);
            _jsonList[0] = jsonEncode(_updatedElement.toJsonObject());
            break;
          case '2':
            final _currentCafes = [...SavedCafeModelV2.fromJson(json).cafes];
            final _updatedCafes = _currentCafes..removeWhere((cafe) => cafe.id == cafeId);
            final _updatedElement = SavedCafeModelV2(cafes: _updatedCafes);
            _jsonList[1] = jsonEncode(_updatedElement.toJsonObject());
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
